import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[1.1rem] border-[1.5px] px-4 py-2 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "border-rosewarm bg-gradient-to-r from-rosewarm to-terracotta text-white shadow-soft hover:brightness-[1.03]",
        variant === "secondary" && "border-line bg-white/70 text-cocoa shadow-float hover:border-rosewarm/40 hover:bg-white",
        variant === "ghost" && "border-transparent bg-transparent text-cocoa hover:bg-white/50",
        variant === "danger" && "border-roseink bg-roseink text-white hover:bg-cocoa",
        className
      )}
      {...props}
    />
  );
}
