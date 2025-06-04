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
    "grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-xs transition-all duration-500 hover:bg-gray-50";
  const containrMergedClassName = twMerge(
    containerBaseClass,
    containerClassName,
  );

  const bodyBaseClassName = "";
  const bodyMergedClassName = twMerge(bodyBaseClassName, bodyBaseClassName);
  return (
    <div className={containrMergedClassName}>
      <div className={bodyMergedClassName}>{children}</div>
    </div>
  );
}
