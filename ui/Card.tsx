import { twMerge } from "tailwind-merge";

interface CardProps {
  children: React.ReactNode;
  bodyClassName?: string;
  containerClassName?: string;
}

export default function Card({
  children,
  bodyClassName,
  containerClassName,
}: CardProps) {
  const containerBaseClass =
    "grid gap-3 rounded-lg border border-gray-200 p-4 shadow-xs transition-all duration-500";
  const containrMergedClassName = twMerge(
    containerBaseClass,
    containerClassName,
  );

  const bodyBaseClassName = "";
  const bodyMergedClassName = twMerge(bodyBaseClassName, bodyClassName);
  return (
    <div className={containrMergedClassName}>
      <div className={bodyMergedClassName}>{children}</div>
    </div>
  );
}
