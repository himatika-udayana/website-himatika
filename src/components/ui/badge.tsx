import type { HTMLAttributes } from "react";

export function Badge({
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold ${className}`}
    />
  );
}
