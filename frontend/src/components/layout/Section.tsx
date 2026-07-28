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
      className={cn(
        "scroll-mt-20 px-sm py-lg sm:px-md sm:py-xl md:px-lg lg:px-xl xl:px-2xl",
        className,
      )}
    >
      {children}
    </section>
  );
}
