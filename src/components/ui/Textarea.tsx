import { TextareaHTMLAttributes, forwardRef } from 'react'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={`flex min-h-[80px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-[#A0A0A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kraft focus-visible:border-kraft disabled:cursor-not-allowed disabled:opacity-50 font-sans transition-colors resize-none ${className}`}
                {...props}
            />
        )
    }
)
Textarea.displayName = 'Textarea'
