export type Channel = {
  id: string
  name: string
  description: string
  logo: string
  streamUrl: string
}

// All streams come from the iptv-org index playlist and are verified to work
// through the proxy from the production server (Helsinki) — several official
// rights-holder feeds (ZDF, TF1, RTVE, ITV, BBC) are geo-blocked from there.
export const channels: Array<Channel> = [
  {
    id: "ard",
    name: "Das Erste (ARD)",
    description: "German free-to-air rights holder — live matches",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/ARD_Dachmarke_2014.svg/960px-ARD_Dachmarke_2014.svg.png",
    // Domestic feed restream — ARD's official international feed blacks out
    // rights-restricted sport, which would hide every World Cup match.
    streamUrl: "https://s6.hopslan.com/ardX/tracks-v1a1/mono.m3u8",
  },
  // Note: Yle's "world" feeds and ARD's international feed replace
  // rights-restricted programming (i.e. live sport) with a blackout slate
  // server-side, so they are useless here despite being official streams.
  {
    id: "dr1",
    name: "DR1",
    description: "Danish rights holder — official feed",
    logo: "https://i.imgur.com/OETzsOI.png",
    streamUrl:
      "https://drlivedr1hls.akamaized.net/hls/live/2113625/drlivedr1/master.m3u8",
  },
  {
    id: "tyc",
    name: "TyC Sports",
    description: "Argentine sports channel — World Cup coverage in Spanish",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/TyC_Sports_logo.svg/960px-TyC_Sports_logo.svg.png",
    streamUrl:
      "https://amg26268-amg26268c14-freelivesports-emea-10267.playouts.now.amagi.tv/ts-us-e2-n2/playlist/amg26268-sportsstudio-tycsports-freelivesportsemea/playlist.m3u8",
  },
  {
    id: "fifaplus",
    name: "FIFA+",
    description: "FIFA's official channel — highlights, classics and shows",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/FIFA%2B_(2025).svg/960px-FIFA%2B_(2025).svg.png",
    streamUrl: "https://jmp2.uk/plu-660c29b5aec9680008f5b4a4.m3u8",
  },
  {
    id: "foxsports",
    name: "FOX Sports",
    description: "FOX Sports Latin America — analysis and shoulder coverage",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/FOX_Sports_logo.svg/960px-FOX_Sports_logo.svg.png",
    streamUrl: "https://jmp2.uk/plu-5a74b8e1e22a61737979c6bf.m3u8",
  },
  {
    id: "bein-xtra",
    name: "beIN SPORTS XTRA",
    description: "Free beIN sports channel — news and highlights",
    logo: "https://i.ibb.co/HT49GPmB/XTRA-2.png",
    streamUrl: "https://bein-xtra-bein.amagi.tv/playlist.m3u8",
  },
]

export function streamProxyUrl(channel: Channel): string {
  return `/api/stream?url=${encodeURIComponent(channel.streamUrl)}`
}
