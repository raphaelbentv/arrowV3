import * as React from "react"
import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  container?: boolean
  item?: boolean
  xs?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  spacing?: number
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, container, item, xs, sm, spacing = 3, ...props }, ref) => {
    if (container) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-wrap",
            spacing && `-m-${spacing}`,
            className
          )}
          {...props}
        />
      )
    }

    if (item) {
      const xsClass = xs ? `w-full grid-cols-${xs}/12` : ""
      const smClass = sm ? `sm:w-${sm}/12` : ""
      return (
        <div
          ref={ref}
          className={cn(
            "p-3",
            xs && `w-full sm:w-${Math.floor((xs / 12) * 100)}`,
            sm && `md:w-${Math.floor((sm / 12) * 100)}`,
            className
          )}
          {...props}
        />
      )
    }

    return <div ref={ref} className={className} {...props} />
  }
)
Grid.displayName = "Grid"

export { Grid }

