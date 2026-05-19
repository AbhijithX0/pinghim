"use client";

import { categories } from "@/data/categories";
import type { EmotionalCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  active: EmotionalCategory;
  onChange: (category: EmotionalCategory) => void;
};

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <nav className="soft-scroll flex gap-2 overflow-x-auto rounded-[1.3rem] border-[1.5px] border-line bg-white/46 p-2 shadow-float">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onChange(category.name)}
          className={cn(
            "h-11 shrink-0 rounded-[1rem] border-[1.5px] px-3 text-xs font-black uppercase tracking-[0.06em] transition",
            active === category.name
              ? "border-rosewarm/70 bg-gradient-to-r from-rosewarm to-terracotta text-white shadow-soft"
              : "border-transparent bg-transparent text-mocha/72 hover:border-line hover:bg-white/72"
          )}
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
}
