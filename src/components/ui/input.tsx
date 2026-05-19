import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-[1.1rem] border-[1.5px] border-line bg-white/76 px-4 text-sm text-cocoa outline-none shadow-float transition placeholder:text-mocha/45 focus:border-rosewarm focus:bg-white",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none rounded-[1.1rem] border-[1.5px] border-line bg-white/76 px-4 py-3 text-sm text-cocoa outline-none shadow-float transition placeholder:text-mocha/45 focus:border-rosewarm focus:bg-white",
        className
      )}
      {...props}
    />
  );
}
