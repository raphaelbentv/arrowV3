import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-105 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        neon: "bg-transparent border-2 shadow-none hover:bg-transparent",
      },
      size: {
        default: "h-14 px-7 py-3 has-[>svg]:px-5",
        sm: "h-10 rounded-md gap-2 px-4 has-[>svg]:px-3",
        lg: "h-16 rounded-md px-8 py-3.5 has-[>svg]:px-6",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "neon",
      size: "lg",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const neonPalette = React.useMemo(
    () => [
      "#39FF14", // neon green
      "#FF00FF", // magenta
      "#00FFFF", // cyan
      "#FFEA00", // yellow
      "#FF073A", // neon red
      "#7DF9FF", // electric blue
      "#FF6EC7", // neon pink
    ],
    []
  )
  const neonColor = React.useMemo(() => {
    const idx = Math.floor(Math.random() * neonPalette.length)
    return neonPalette[idx]
  }, [neonPalette])

  const isNeon = (variant ?? "neon") === "neon"
  const neonStyles: React.CSSProperties | undefined = isNeon
    ? {
        background: "transparent",
        borderColor: neonColor,
        color: neonColor,
        boxShadow: `0 0 12px ${neonColor}66, 0 0 24px ${neonColor}33`,
      }
    : undefined

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={{ ...(props as any).style, ...(neonStyles ?? {}) }}
      {...props}
    />
  )
}

export { Button, buttonVariants }
