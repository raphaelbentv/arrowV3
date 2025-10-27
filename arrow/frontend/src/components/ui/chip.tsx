import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  onDelete?: () => void
  variant?: "default" | "outline" | "secondary"
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, children, onDelete, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "border-primary/20 text-primary bg-primary/10 hover:bg-primary/20",
      outline: "border border-input bg-background hover:bg-accent",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          variants[variant],
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-1 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
    )
  }
)
Chip.displayName = "Chip"

export { Chip }

