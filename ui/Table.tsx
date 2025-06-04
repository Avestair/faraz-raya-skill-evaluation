import {
  TableBodyProps,
  TableCellProps,
  TableHeaderProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
} from "@/types/TableTypes";
import { truncateString } from "@/utils/utils";

import React from "react";
import { twMerge } from "tailwind-merge";

export function Table({ children, className }: TableProps) {
  const baseClassName = "grid border border-gray-200 rounded-sm";
  const mergedClassName = twMerge(baseClassName, className);
  return <table className={mergedClassName}>{children}</table>;
}

export function TableBody({ children, className }: TableBodyProps) {
  const baseClassName =
    "bg-white text-black dark:bg-stone-900 dar:text-gray-200";
  const mergedClassName = twMerge(baseClassName, className);

  return <tbody className={mergedClassName}>{children}</tbody>;
}

export function TableCell({ children, className }: TableCellProps) {
  const baseClassName = "whitespace-nowrap turncate";
  const mergedClassName = twMerge(baseClassName, className);
  return (
    <td className={mergedClassName}>
      {typeof children === "string" ? truncateString(children, 13) : children}
    </td>
  );
}

export function TableHead({ children, className }: TableHeadProps) {
  const baseClassName =
    "bg-gray-100 text-gray-600 dark:bg-stone-950 dark:text-gray-200 md:text-base text-sm border-b border-gray-200 rounded-t-sm px-4";
  const mergedClassName = twMerge(baseClassName, className);

  return <thead className={mergedClassName}>{children}</thead>;
}

export function TableHeader({
  children,
  className,
  onClick,
}: TableHeaderProps) {
  const baseClassName = "p-2";
  const mergedClassName = twMerge(baseClassName, className);

  return (
    <th onClick={onClick} className={mergedClassName}>
      {children}
    </th>
  );
}

export function TableRow({ children, className }: TableRowProps) {
  const baseClassName = `text-sm lg:text-base border-b border-gray-200 even:bg-gray-100 last:border-0`;
  const mergedClassName = twMerge(baseClassName, className);
  return <tr className={mergedClassName}>{children}</tr>;
}
