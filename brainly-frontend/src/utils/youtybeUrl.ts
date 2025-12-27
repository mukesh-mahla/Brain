export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url)

    let videoId: string | null = null

    
    if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1)
    }


    if (parsedUrl.hostname.includes("youtube.com")) {
      videoId =
        parsedUrl.searchParams.get("v") ||
        parsedUrl.pathname.split("/").pop() ||
        null
    }

    if (!videoId) return null

    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return null
  }
}
