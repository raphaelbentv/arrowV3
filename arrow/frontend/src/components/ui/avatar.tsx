import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex size-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt} className="aspect-square size-full" />
        ) : (
          <div className="flex size-full items-center justify-center bg-secondary text-secondary-foreground">
            {children}
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }

