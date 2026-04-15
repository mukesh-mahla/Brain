import { ShareIcon } from "../icons/share";
import React, { useEffect } from "react";
import { getYouTubeEmbedUrl } from "../utils/youtybeUrl";
import { DeleteIcon } from "../icons/deleteIcon";



interface CardProps {
  id: string;
  link: string;
  title: string;
  type: "twitter" | "youtube";
  showAction?:boolean
  summary: string;
  tags: string[];
  onDelete: (id: string) => void;
}

export const Card = React.memo(({ id, link, title, type,showAction=true, summary, tags, onDelete }: CardProps) => {

  return (
    <div
      className={`p-5 bg-white rounded-xl border border-slate-200
        w-80 flex flex-col gap-3 
        transition hover:shadow-md `}

    >
      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div className="font-semibold text-left text-slate-900 leading-snug line-clamp-2 ">
          {title}
        </div>


        <div className="flex  items-end gap-4">
          <div> </div>
          <a
            href={(link || "").replace("embed", "watch")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 -translate-y-1 hover:text-slate-600 shrink-0 pl-1"
          >
            <ShareIcon size="md" />
          </a>
          <div >
           {showAction && (
  <DeleteIcon onClick={() => onDelete(id)} />
)}
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
          {summary}
        </p>
      )}

      {/* TAGS */}
      {(tags || []).length > 0 && (
        <div className="flex flex-wrap gap-2">
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

      {/* MEDIA */}
      <div className="pt-2 border-t border-slate-100 ">
        {type === "youtube" && <YoutubeEmbed link={link} />}
        {type === "twitter" && <TwitterEmbed link={link} />}
      </div>
    </div>
  );
});



export function YoutubeEmbed({ link }: { link: string }) {
  const embedUrl = getYouTubeEmbedUrl(link);

  if (!embedUrl) {
    return <p className="text-sm text-slate-500">Invalid YouTube link</p>;
  }

  return (
    <div className="w-full rounded-lg overflow-hidden bg-black">
      <iframe
        className="w-full h-full"
        src={embedUrl}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
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
      <a href={(link || "").replace("x.com", "twitter.com")}></a>
    </blockquote>
  )
}










