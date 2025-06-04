"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SubMenuElementProps } from "@/types/SideBarTypes";
import { twMerge } from "tailwind-merge";

export default function SubMenuElement({
  title,
  href,
  className,
}: SubMenuElementProps) {
  const [isActive, setIsActive] = useState(false);
  const currentRoute = usePathname();

  useEffect(() => {
    const currentNormalized = currentRoute.split("/").filter(Boolean).join("/");
    const hrefNormalized = href.split("/").filter(Boolean).join("/");
    setIsActive(currentNormalized === hrefNormalized);
  }, [href, currentRoute]);

  const baseClassName = "flex cursor-pointer gap-4 rounded-md bg-white p-2";
  const mergedClassName = twMerge(baseClassName, className);

  return (
    <Link href={href} className={mergedClassName}>
      <span
        className={`h-8 w-1 rounded-xl ${
          isActive ? "bg-stone-900" : "bg-gray-300"
        }`}
      ></span>
      <span className="mt-1.5 text-sm">{title}</span>
    </Link>
  );
}
