import type { ReactElement } from "react"


interface sideProps{
    text:string,
    Icon:ReactElement
}

export function SidebarItem ({text,Icon}:sideProps){
    
    return <div className="flex rounded text-grey-400 cursor-pointer hover:bg-grey-200 max-w-48 pl-4 transation-all duration-500">
              <div className="p-2 ">{Icon}</div>
              <div className="p-2 text-center ">{text}</div> 
    </div>
}