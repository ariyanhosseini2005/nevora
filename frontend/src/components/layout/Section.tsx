import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  ariaLabel,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn("px-lg py-xl md:px-xl lg:px-2xl", className)}
    >
      {children}
    </section>
  );
}
