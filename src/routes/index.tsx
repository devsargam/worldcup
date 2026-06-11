import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { VideoPlayer } from "@/components/video-player"
import { channels, streamProxyUrl } from "@/lib/channels"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "FIFA World Cup 2026 — Live" }],
  }),
  component: App,
})

function App() {
  const [channel, setChannel] = useState(channels[0])

  return (
    <main className="mx-auto flex min-h-svh max-w-4xl flex-col gap-6 p-6">
      <header className="flex items-center gap-3">
        <img
          src={channel.logo}
          alt={`${channel.name} logo`}
          className="h-10 w-10 rounded bg-white object-contain p-1"
        />
        <div>
          <h1 className="text-lg font-semibold">{channel.name}</h1>
          <p className="text-sm text-muted-foreground">{channel.description}</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-medium text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          LIVE
        </span>
      </header>

      <VideoPlayer src={streamProxyUrl(channel)} />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {channels.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setChannel(c)}
            className={`flex items-center gap-2 rounded-lg border p-2 text-left text-sm transition-colors ${
              c.id === channel.id
                ? "border-red-600 bg-red-50"
                : "border-border hover:bg-accent"
            }`}
          >
            <img
              src={c.logo}
              alt=""
              className="h-8 w-8 shrink-0 rounded bg-white object-contain p-0.5"
            />
            <span className="min-w-0">
              <span className="block truncate font-medium">{c.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {c.description}
              </span>
            </span>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Streams sourced from the{" "}
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
