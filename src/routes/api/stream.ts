import { createFileRoute } from "@tanstack/react-router"

// FIFA+ (720p) from the iptv-org index playlist (tvg-id="FIFAPlus.uk")
export const FIFA_PLUS_STREAM =
  "https://jmp2.uk/plu-660c29b5aec9680008f5b4a4.m3u8"

// Upstream CDNs only allow CORS from their own origins, so the browser can't
// fetch streams directly — this route proxies playlists and segments,
// rewriting every URI in m3u8 files to point back through the proxy.
export const Route = createFileRoute("/api/stream")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          return await proxyStream(request)
        } catch {
          return new Response("Proxy error", { status: 502 })
        }
      },
    },
  },
})

async function proxyStream(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url)
  const target = requestUrl.searchParams.get("url") ?? FIFA_PLUS_STREAM

  let upstream: URL
  try {
    upstream = new URL(target)
  } catch {
    return new Response("Invalid url", { status: 400 })
  }
  if (upstream.protocol !== "http:" && upstream.protocol !== "https:") {
    return new Response("Invalid protocol", { status: 400 })
  }

  let res: Response
  try {
    res = await fetch(upstream, { redirect: "follow" })
  } catch {
    return new Response("Upstream fetch failed", { status: 502 })
  }
  if (!res.ok) {
    return new Response(`Upstream error: ${res.status}`, { status: 502 })
  }

  // Don't trust content-type: some CDNs label binary AES keys as mpegurl.
  // Go by the URL path and verify the body is a playlist.
  const contentType = res.headers.get("content-type") ?? ""
  const isPlaylist =
    upstream.pathname.endsWith(".m3u8") ||
    new URL(res.url).pathname.endsWith(".m3u8")

  if (!isPlaylist) {
    return new Response(res.body, {
      status: res.status,
      headers: {
        "content-type": contentType || "application/octet-stream",
        "cache-control": "no-store",
      },
    })
  }

  // res.url is the final URL after redirects — relative URIs in the
  // playlist must resolve against it, not the original target.
  const base = res.url
  const proxied = (uri: string) =>
    `/api/stream?url=${encodeURIComponent(new URL(uri, base).href)}`

  const text = await res.text()
  if (!text.startsWith("#EXTM3U")) {
    return new Response(text, {
      headers: {
        "content-type": contentType || "application/octet-stream",
        "cache-control": "no-store",
      },
    })
  }
  const rewritten = text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim()
      if (trimmed === "") return line
      if (trimmed.startsWith("#")) {
        return line.replace(
          /URI="([^"]+)"/g,
          (_, uri: string) => `URI="${proxied(uri)}"`
        )
      }
      return proxied(trimmed)
    })
    .join("\n")

  return new Response(rewritten, {
    headers: {
      "content-type": "application/vnd.apple.mpegurl",
      "cache-control": "no-store",
    },
  })
}
