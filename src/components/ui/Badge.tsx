import * as React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'green'
}

const variantStyles = {
  default: 'bg-charcoal text-white',
  green: 'bg-green-accent text-white',
}

export function Badge({
  className = '',
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-sans text-xs font-medium px-2.5 py-0.5 rounded-md ${variantStyles[variant]} ${className}`}
      {...props}
    />
  )
}
