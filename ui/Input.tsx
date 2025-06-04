import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  ariaLabel?: string;
  className?: string;
}

export default function Input({
  type,
  ariaLabel,
  className,
  ...props
}: InputProps) {
  const baseClassName =
    "focus:border-black focus:dark:border-white rounded-sm border border-gray-200 p-2 text-gray-800 transition-all duration-300 outline-none placeholder:text-sm placeholder:text-gray-500";
  const mergedClassName = twMerge(baseClassName, className);
  return (
    <input
      aria-label={ariaLabel}
      type={type}
      className={mergedClassName}
      {...props}
    />
  );
}
