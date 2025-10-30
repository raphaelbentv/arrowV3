import * as React from "react"

import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "particle-label leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-6 md:mt-8 mb-3 md:mb-4",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }

