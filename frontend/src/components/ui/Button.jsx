import * as React from "react"
import { cn } from "./Card"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus-visible:ring-border-focus active:scale-95 shadow-sm"
  
  const variants = {
    default: "bg-primary text-white hover:bg-primary-hover shadow-md",
    outline: "border border-border-strong bg-transparent hover:bg-surface-hover text-text-primary",
    ghost: "bg-transparent hover:bg-surface-hover text-text-primary shadow-none",
    danger: "bg-error text-white hover:bg-red-700",
  }

  const sizes = {
    default: "h-11 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-14 px-8 rounded-xl text-base",
    icon: "h-11 w-11",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
