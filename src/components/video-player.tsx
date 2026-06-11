import Hls from "hls.js"
import { useEffect, useRef, useState } from "react"

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setError(null)

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.warn("hls error", data.type, data.details, data.fatal)
        if (!data.fatal) return
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad()
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError()
            break
          default:
            setError("Playback failed — the stream may be offline.")
            hls.destroy()
        }
      })
      return () => hls.destroy()
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
      return () => {
        video.removeAttribute("src")
        video.load()
      }
    }

    setError("HLS playback is not supported in this browser.")
  }, [src])

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        className="h-full w-full"
        controls
        autoPlay
        muted
        playsInline
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-white">
          {error}
        </div>
      )}
    </div>
  )
}
