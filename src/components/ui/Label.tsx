import * as React from 'react'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className = '', ...props }: LabelProps) {
  return (
    <label
      className={`block font-sans text-sm font-medium text-charcoal ${className}`}
      {...props}
    />
  )
}
