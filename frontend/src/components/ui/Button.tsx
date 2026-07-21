"use client";

import { motion } from "framer-motion";
import type { MouseEventHandler } from "react";
import { cn } from "@/lib/utils";
import { motionTiming } from "@/constants/animations";

type ButtonVariant = "primary" | "secondary";

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-premium-gold text-coffee-dark",
  secondary: "bg-transparent text-cream border border-premium-gold",
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full px-md py-sm text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-premium-gold";

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], className);

  if ("href" in props && props.href) {
    const { href, onClick } = props as ButtonAsLink;
    return (
      <motion.a
        href={href}
        onClick={onClick}
        className={classes}
        whileHover={{ scale: motionTiming.scaleAmount }}
      >
        {children}
      </motion.a>
    );
  }

  const { type = "button", disabled, onClick } = props as ButtonAsButton;
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      whileHover={{ scale: motionTiming.scaleAmount }}
    >
      {children}
    </motion.button>
  );
}
