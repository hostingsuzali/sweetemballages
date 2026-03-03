import { LabelHTMLAttributes, forwardRef } from 'react'

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={`font-sans text-sm font-medium text-charcoal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
                {...props}
            />
        )
    }
)
Label.displayName = 'Label'
