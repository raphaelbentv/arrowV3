import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, defaultValue = "", ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<string[]>(
      defaultValue ? [defaultValue] : []
    )

    const toggleItem = (value: string) => {
      setOpenItems((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      )
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              openItems,
              toggleItem,
            })
          }
          return child
        })}
      </div>
    )
  }
)
Accordion.displayName = "Accordion"

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  openItems?: string[]
  toggleItem?: (value: string) => void
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, openItems, toggleItem, ...props }, ref) => {
    const isOpen = openItems?.includes(value) ?? false

    return (
      <div
        ref={ref}
        className={cn("border rounded-lg", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isOpen,
              onClick: () => toggleItem?.(value),
            })
          }
          return child
        })}
      </div>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  onClick?: () => void
}

const AccordionTrigger = React.forwardRef<HTMLDivElement, AccordionTriggerProps>(
  ({ className, children, isOpen = false, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer hover:bg-accent transition-colors",
          className
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        <ChevronDownIcon
          className={cn(
            "size-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </div>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, isOpen = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
          className
        )}
        {...props}
      >
        <div className="p-4 pt-0">{children}</div>
      </div>
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

