import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-sans"

        const variants = {
            primary: "bg-charcoal hover:bg-[#3D3D3D] text-white focus-visible:ring-charcoal",
            secondary: "bg-kraft hover:bg-[#b3966c] text-white focus-visible:ring-kraft",
            outline: "border-2 border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-white focus-visible:ring-charcoal",
            ghost: "hover:bg-background hover:text-charcoal text-muted focus-visible:ring-charcoal",
        }

        const sizes = {
            sm: "h-9 px-3",
            md: "h-10 px-4 py-2",
            lg: "h-14 px-8 py-4 text-base",
        }

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'
