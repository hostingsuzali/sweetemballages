import * as React from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-10 w-full rounded-lg border border-border-neutral bg-white px-3 py-2 font-sans text-sm text-charcoal placeholder:text-muted focus:border-kraft focus:outline-none focus:ring-2 focus:ring-kraft/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
