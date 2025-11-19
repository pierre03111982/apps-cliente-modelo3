import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 shadow-sm focus:border-accent-1 focus:outline-none focus:ring-2 focus:ring-accent-1/30",
            "placeholder:text-slate-400",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            icon ? "pl-12" : "px-4",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }


