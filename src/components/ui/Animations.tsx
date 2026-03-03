"use client"
import { motion } from 'motion/react'
import { ReactNode } from 'react'

interface AnimationProps {
    children?: ReactNode
    delay?: number
    className?: string
    once?: boolean
}

export function FadeIn({ children, delay = 0, className = '', once = true }: AnimationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function FadeInRight({ children, delay = 0, className = '', once = true }: AnimationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function ScaleIn({ children, delay = 0, className = '', once = true }: AnimationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once }}
            transition={{ duration: 0.6, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function AnimatedBox({ children, className = '', delay = 0 }: AnimationProps) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function SpringScale({ children, className = '', delay = 0 }: AnimationProps) {
    return (
        <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, type: 'spring', stiffness: 200 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
