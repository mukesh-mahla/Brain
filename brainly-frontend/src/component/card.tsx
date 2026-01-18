import { ShareIcon } from "../icons/share";
import { useEffect } from "react";
import { getYouTubeEmbedUrl } from "../utils/youtybeUrl";

interface CardProps {
  link: string;
  title: string;
  type: "twitter" | "youtube";
  summary: string;
  tags: string[];
}

export const Card = ({ link, title, type, summary, tags }: CardProps) => {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 w-80 flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-900 leading-snug">
          {title}
        </h3>

        <a
          href={link.replace("embed", "watch")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-600"
        >
          <ShareIcon size="md" />
        </a>
      </div>

      {/* SUMMARY */}
      {summary && (
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          {summary}
        </p>
      )}

      {/* TAGS */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="
                px-2 py-1 text-xs rounded-full
                bg-indigo-50 text-indigo-600
                border border-indigo-100
              "
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div className="mt-auto">
        {type === "youtube" && <YoutubeEmbed link={link} />}
        {type === "twitter" && <TwitterEmbed link={link} />}
      </div>
    </div>
  );
};


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










