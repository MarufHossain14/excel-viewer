"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: SwitchPrimitive.SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full border border-transparent bg-border-strong transition-colors data-[state=checked]:bg-accent focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-5 translate-x-0 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4" />
    </SwitchPrimitive.Root>
  );
}
