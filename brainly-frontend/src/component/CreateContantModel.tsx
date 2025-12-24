import { useRef, useState } from "react";
import { CrossIcon } from "../icons/croos";
import { Button } from "./button";
import { Input } from "./Input";
import axios from "axios";
      const BACKEND_URL  =  import.meta.env.VITE_BACKEND_URL

enum ContentType{
youtube="youtube",
twitter="twitter"
}

export function CreateContentmodal({open,onClose}:{open:boolean,onClose:()=>void}){
             const titleRef = useRef<HTMLInputElement>(null)
             const linkRef = useRef<HTMLInputElement>(null)
             const [type,setType] = useState(ContentType.youtube)

             async function addContent(){
                     const title = titleRef.current?.value
                       const link = linkRef.current?.value
                      await axios.post(`${BACKEND_URL}/addcontent`,{link,type,title},{withCredentials:true})
                      onClose()
                    }

    return <div>
         {open && <div className="w-screen h-screen fixed top-0 left-0 bg-slate-600 bg-opacity-60 flex justify-center">
        <div className="flex  justify-center items-center">
            
               <span className="bg-white opacity-100 p-4 rounded max-h-80 ">
                    <div className="flex justify-end">
                        <div onClick={onClose} className="cursor-pointer">
                          <CrossIcon/>
                        </div>
                    </div>
                    <div>
                        <Input ref={titleRef} placeholder={"title"}/>
                        <Input ref={linkRef} placeholder={"link"} />
                        <h1 className="text-center">type</h1>
                        <div className="flex gap-2 p-4 justify-center">
                              <Button text="youtube" size="sm" varient={type === ContentType.youtube ? "primary":"secondary"} onClick={()=>{setType(ContentType.youtube)}}/>
                              <Button text="twitter" size="sm" varient={type === ContentType.twitter ? "primary":"secondary"}onClick={()=>{setType(ContentType.twitter)}}/>
                        </div>
                    <div className="flex justify-center ">
                       <Button onClick={addContent} varient="primary" text="submit" size="sm" />
                   </div> 
                     </div>
               </span>
        </div>
            </div>}
    </div>
}



