// sidebar.tsx
import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/twitterIcon";
import { YoutubeIcon } from "../icons/youtube";
import { SidebarItem } from "./sideBarItem";

export function Sidebar() {
  return (
    <div className="bg-white h-full w-full border-r border-slate-200 flex flex-col">

      {/* LOGO */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="text-purple-600 shrink-0">
          <Logo />
        </div>
        <div className="text-blue-900 font-semibold text-xl">Brainly</div>
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <SidebarItem text="Twitter" Icon={<TwitterIcon />} />
        <SidebarItem text="YouTube" Icon={<YoutubeIcon />} />
      </nav>
    </div>
  );
}