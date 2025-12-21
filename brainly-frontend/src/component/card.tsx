import { ShareIcon } from "../icons/share"

interface cardProps{
link:string,
title:string,
type:"twitter" | "youtube"
}

export const Card = ({link,title,type}:cardProps)=>{
    return <div >
        <div className="p-4 bg-white rounded-md shadow-md border-slate-200 border min-w-72 min-h-80">
            <div className="flex justify-between">
                <div className="flex items-center text-sm">
                   <div className="text-grey-400 pr-2"><ShareIcon size="md"/></div> 
                     {title}
                </div>
                <div className="flex item-center">
                    <div className="pr-2 text-grey-400"> <a href={link} target="_blank"><ShareIcon size="md"/></a></div>
                    <div className="text-grey-400"> <ShareIcon size="md"/></div>
                </div>
            </div>
    <div className="pt-4 ">
        {type === "youtube" && <iframe className="w-full rounded"  src={link.replace("watch","embed").replace("?v=","/")} title="YouTube video player" frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
             referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}
            
            {type ==="twitter" && <blockquote className="twitter-tweet h-full">
                <a href={link.replace("x.com","twitter.com")}></a> 
             </blockquote>}
             
    </div> 
    </div>
</div>
}