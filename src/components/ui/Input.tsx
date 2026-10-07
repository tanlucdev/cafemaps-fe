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
            "text-[16px] transition-colors duration-200 lg:text-sm",
            "focus:!rounded-xl focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!rounded-xl focus-visible:!border-[#8f5a16] focus-visible:!outline-none",
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
