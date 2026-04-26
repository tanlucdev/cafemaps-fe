import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3 text-[var(--foreground-muted)] pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--card)]",
            "text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]",
            "text-sm transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0 focus:border-[var(--accent)]",
            leftIcon ? "pl-10" : "pl-4",
            rightIcon ? "pr-10" : "pr-4",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-[var(--foreground-muted)]">
            {rightIcon}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
