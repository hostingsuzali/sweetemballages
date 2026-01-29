import * as React from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'default'
  asChild?: boolean
}

const variantStyles = {
  primary:
    'bg-charcoal text-white hover:bg-charcoal/90 focus-visible:ring-kraft',
  secondary:
    'bg-transparent text-charcoal border-2 border-charcoal hover:bg-charcoal hover:text-white focus-visible:ring-kraft',
  ghost:
    'bg-transparent text-charcoal hover:text-kraft focus-visible:ring-kraft',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  default: 'px-6 py-3 text-base rounded-lg',
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-sans font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  )
}
