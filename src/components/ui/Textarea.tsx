import * as React from 'react'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`flex min-h-[80px] w-full rounded-lg border border-border-neutral bg-white px-3 py-2 font-sans text-sm text-charcoal placeholder:text-muted focus:border-kraft focus:outline-none focus:ring-2 focus:ring-kraft/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className}`}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'
