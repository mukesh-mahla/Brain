// sidebarItem.tsx
import type { ReactElement } from "react"

interface SideProps {
  text: string;
  Icon: ReactElement;
}

export function SidebarItem({ text, Icon }: SideProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-100 px-3 py-2.5 transition-all duration-200 w-full">
      <div className="shrink-0 text-slate-500">{Icon}</div>
      <div className="text-sm font-medium">{text}</div>
    </div>
  );
}