import { ShareIcon } from "../icons/share"
import { useEffect } from "react"
import { getYouTubeEmbedUrl } from "../utils/youtybeUrl"

interface CardProps {
  link: string
  title: string
  type: "twitter" | "youtube"
}

export const Card = ({ link, title, type }: CardProps) => {
  return (
    <div className="p-4 bg-white rounded-md shadow border border-slate-200 min-w-72 min-h-80">

      {/* Header */}
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="font-medium">{title}</span>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600"
        >
          <ShareIcon size="md" />
        </a>
      </div>

      {/* Content */}
      <div className="pt-2">
        {type === "youtube" && <YoutubeEmbed link={link} />}
        {type === "twitter" && <TwitterEmbed link={link} />}
      </div>

    </div>
  )
}





export function YoutubeEmbed({ link }: { link: string }) {
  const embedUrl = getYouTubeEmbedUrl(link)

  if (!embedUrl) {
    return <p className="text-sm text-gray-500">Invalid YouTube link</p>
  }

  return (
    <iframe
      className="w-full aspect-video rounded"
      src={embedUrl}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}



declare global {
  interface Window {
    twttr?: any
  }
}

export function TwitterEmbed({ link }: { link: string }) {
  useEffect(() => {
    if (window.twttr) {
      window.twttr.widgets.load()
    }
  }, [])

  return (
    <blockquote className="twitter-tweet">
      <a href={link.replace("x.com", "twitter.com")}></a>
    </blockquote>
  )
}










