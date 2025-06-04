"use client";

import { useSidebar } from "@/contexts/SideBarContext";
import SideBarElement from "@/ui/menu/SideBarElement";
import { motion, AnimatePresence } from "motion/react";
import React from "react";
import {
  PiSidebarSimpleDuotone,
  PiUserDuotone,
  PiUserListDuotone,
} from "react-icons/pi";

export default function SideBar() {
  const userSubMenu = [
    { title: "کاربران", href: "/users" },
    { title: "کاربران", href: "/users" },
  ];

  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          className="fixed top-0 right-0 z-30 flex h-[100vh] w-[20%] min-w-[280px] flex-col overflow-y-auto border-l border-gray-400 bg-gray-100 text-gray-700 shadow-lg md:static md:left-0 md:w-auto md:min-w-[280px] md:border-t-0 md:border-r md:border-l-0 md:shadow-none lg:z-0 dark:border-l dark:bg-stone-900 dark:text-gray-100"
        >
          {/* Sidebar Header Section */}
          <div className="relative flex items-center justify-between border-b border-gray-400 p-4">
            <div className="flex w-full items-center justify-between">
              <span className="text-xl font-bold">Hamed Iravni</span>
              <PiSidebarSimpleDuotone
                onClick={toggleSidebar}
                className="size-7 cursor-pointer text-gray-500 md:hidden"
              />
            </div>
          </div>

          {/* Menu Items Section */}
          <div className="flex flex-col gap-2 p-2">
            <SideBarElement
              title="همه کاربران"
              icon={<PiUserListDuotone className="size-6" />}
              hasSubMenu={true}
              subMenuItems={userSubMenu}
              href="/users"
            />
            <SideBarElement
              title="جست و جوی کاربر"
              icon={<PiUserDuotone className="size-6" />}
              href="/searchuser"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
