"use client";

import { SubMenuProps } from "@/types/SideBarTypes";
import SubMenuElement from "./SubMenuElement";
import { twMerge } from "tailwind-merge";

export default function SubMenu({ subMenuItems, className }: SubMenuProps) {
  const baseClassName = "grid w-[90%] rounded-md bg-white px-2 py-1";
  const mergedClassName = twMerge(baseClassName, className);

  return (
    <div className="my-1 flex w-full justify-center">
      <div className={mergedClassName}>
        {subMenuItems?.map((item, index) => (
          <SubMenuElement title={item.title} href={item.href} key={index} />
        ))}
      </div>
    </div>
  );
}
