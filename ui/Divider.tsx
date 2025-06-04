import { twMerge } from "tailwind-merge";

interface DividerProps {
  dir: "ver" | "hor";
  className?: string;
}

export default function Divider({ dir, className }: DividerProps) {
  const baseClassName = `bg-gray-300 ${dir === "hor" ? "w-1" : "h-1"}`;
  const mergedClassName = twMerge(baseClassName, className);
  return <span className={mergedClassName}></span>;
}
