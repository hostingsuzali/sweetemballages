import { InputHTMLAttributes, forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#A0A0A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kraft focus-visible:border-kraft disabled:cursor-not-allowed disabled:opacity-50 font-sans transition-colors ${className}`}
                {...props}
            />
        )
    }
)
Input.displayName = 'Input'
