import { createFileRoute } from "@tanstack/react-router"
import { VideoPlayer } from "@/components/video-player"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "FIFA World Cup 2026 — FIFA+ Live" }],
  }),
  component: App,
})

function App() {
  return (
    <main className="mx-auto flex min-h-svh max-w-4xl flex-col gap-6 p-6">
      <header className="flex items-center gap-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/FIFA%2B_(2025).svg/960px-FIFA%2B_(2025).svg.png"
          alt="FIFA+ logo"
          className="h-10 w-10 rounded bg-white object-contain p-1"
        />
        <div>
          <h1 className="text-lg font-semibold">FIFA+</h1>
          <p className="text-sm text-muted-foreground">
            FIFA&apos;s official channel — home of the FIFA World Cup 2026
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-medium text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          LIVE
        </span>
      </header>

      <VideoPlayer src="/api/stream" />

      <p className="text-xs text-muted-foreground">
        720p stream sourced from the{" "}
        <a
          href="https://iptv-org.github.io/iptv/index.m3u"
          className="underline underline-offset-2"
        >
          iptv-org
        </a>{" "}
        public playlist.
      </p>
    </main>
  )
}
