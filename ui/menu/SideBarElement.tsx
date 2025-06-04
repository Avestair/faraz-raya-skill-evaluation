"use client";

import Link from "next/link";
import { PiArrowLeft, PiCaretLeftLight } from "react-icons/pi";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import SubMenu from "./SubMenu";
import { SideBarElementProps } from "@/types/SideBarTypes";
import { twMerge } from "tailwind-merge";

export default function SideBarElement({
  title,
  icon,
  href,
  className,
  subMenuItems,
  hasSubMenu,
  isNotLink,
  onClick,
}: SideBarElementProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // its not a link and it's a btn that runs a fucntion like loggingout user
  if (isNotLink) {
    const baseBtnClassName =
      "group flex h-fit cursor-pointer justify-between p-2 px-4 pr-6 pl-6";
    const mergedBtnClassName = twMerge(baseBtnClassName, className);

    return (
      <div className={mergedBtnClassName} onClick={onClick}>
        <div className="flex gap-4">
          {icon}
          <span>{title}</span>
        </div>
      </div>
    );
  }

  // if it has sub menu
  if (hasSubMenu) {
    const baseSubMenuClassName =
      "group flex h-fit w-full cursor-pointer justify-between p-2 px-4 select-none";
    const mergedSubMenuClassName = twMerge(baseSubMenuClassName, className);

    return (
      <div className="grid gap-1">
        <div
          className={mergedSubMenuClassName}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex gap-4">
            {icon}
            <span>{title}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? -90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <PiCaretLeftLight className="size-6" />
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <SubMenu subMenuItems={subMenuItems} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // if its just a normal link
  const baseLinkClassName =
    "group flex h-fit justify-between p-2 px-4 pr-6 pl-6 ";
  const mergedLinkClassName = twMerge(baseLinkClassName, className);
  return (
    <Link
      href={href}
      className={mergedLinkClassName}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4">
        {icon}
        <span>{title}</span>
      </div>
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          rotate: isHovered ? 0 : -90,
        }}
        transition={{ duration: 0.2 }}
      >
        <PiArrowLeft className="size-6" />
      </motion.div>
    </Link>
  );
}
