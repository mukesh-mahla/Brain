
import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/twitterIcon";
import { YoutubeIcon } from "../icons/youtube";
import { SidebarItem } from "./sideBarItem";

export function Sidebar(){
    return <div className="bg-white absolute top-0 left-o h-screen w-72 border-r-2">
        <div className="flex text-2xl gap-6 pt-4 pl-4">
                <div className="text-purple-600"><Logo/></div> 
              <div>Brainly</div>
                </div>
        <div className="pt-6 pl-6">
             <SidebarItem text="twitter" Icon={<TwitterIcon/>} />
             <SidebarItem text="youtube" Icon={<YoutubeIcon/>} />
        </div>
    </div>
}