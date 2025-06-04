"use client";

import { useSidebar } from "@/contexts/SideBarContext";
import { PiSidebarSimpleDuotone, PiUserCircleDuotone } from "react-icons/pi";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="flex w-full justify-between p-2">
      <button
        onClick={toggleSidebar}
        className="cursor-pointer text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <PiSidebarSimpleDuotone className="size-7 rotate-180" />{" "}
      </button>
      <div className="flex gap-4 rounded-full border border-gray-200 bg-white p-2 dark:bg-stone-800">
        <PiUserCircleDuotone className="size-6" />
        <p>وارد شوید</p>
      </div>
    </div>
  );
}
