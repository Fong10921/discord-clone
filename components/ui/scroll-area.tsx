"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & { thumbColor?: string }
>(({ className, orientation = "vertical", thumbColor, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className={cn("relative flex-1 rounded-full", thumbColor)} />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))

// In ScrollArea component, pass thumbColor to ScrollBar
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & { thumbColor?: string }
>(({ className, children, thumbColor, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className={cn(`h-full w-full rounded-[inherit]`)}>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar thumbColor={thumbColor}/>
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))

export { ScrollArea, ScrollBar }
