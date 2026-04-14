"use client"
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { motion } from 'motion/react'
import { getProductImageUrl } from '@/lib/storage'
import Image from 'next/image'
import { ArrowUpRight, Ruler, Package } from 'lucide-react'

export interface Product {
    id: string
    name: string
    category: string
    categoryId?: string
    dimensions: string
    packaging: string
    price: number
    priceUnit: string
    customizable: boolean
    usage: string[]
    description?: string
    image_url?: string
}

interface ProductCardProps {
    product: Product
    index?: number
    /** Avoid scroll-reveal (opacity 0) when cards are nested; in-view can fail inside overflow/stacking contexts. */
    revealImmediately?: boolean
}

export function ProductCard({ product, index = 0, revealImmediately = false }: ProductCardProps) {
    return (
        <motion.div
            initial={revealImmediately ? { opacity: 1, y: 0 } : { y: 30, opacity: 0 }}
            whileInView={revealImmediately ? undefined : { y: 0, opacity: 1 }}
            viewport={revealImmediately ? undefined : { once: true }}
            transition={{ delay: revealImmediately ? 0 : index * 0.08, duration: 0.5, ease: 'easeOut' }}
            className="h-full"
        >
            <Link
                href={`/produits/${product.id}`}
                className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 ease-out"
                style={{ transition: 'box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease' }}
            >
                {/* ── Image ── */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                        src={getProductImageUrl(product.image_url || null)}
                        alt={product.name}
                        fill
                        unoptimized={true}
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                    {/* Arrow icon reveal */}
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 text-[#8B6914]" />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {product.customizable && (
                            <Badge className="bg-[#4a724a] text-white text-[10px] px-2 py-0.5 shadow-sm">
                                Personnalisable
                            </Badge>
                        )}
                    </div>

                    {/* Category pill – slides up from bottom on hover */}
                    <div className="absolute bottom-3 left-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350">
                        <span className="inline-block bg-white/90 backdrop-blur-sm text-[#8B6914] text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                            {product.category}
                        </span>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="flex flex-col flex-1 p-5">
                    {/* Category (visible without hover) */}
                    <span className="font-sans text-[11px] font-semibold text-[#8B6914] uppercase tracking-widest mb-1 group-hover:opacity-0 transition-opacity duration-200">
                        {product.category}
                    </span>

                    {/* Name */}
                    <h3 className="font-heading text-base font-bold text-gray-800 mb-3 leading-snug line-clamp-2 group-hover:text-[#8B6914] transition-colors duration-300">
                        {product.name}
                    </h3>

                    {/* Specs */}
                    <div className="flex flex-col gap-2 mb-4 flex-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Ruler className="w-3.5 h-3.5 text-[#8B6914] flex-shrink-0" />
                            <span className="truncate">{product.dimensions}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Package className="w-3.5 h-3.5 text-[#8B6914] flex-shrink-0" />
                            <span className="truncate">{product.packaging}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 pt-4">
                        {/* Price row */}
                        <div className="flex items-end justify-between">
                            <div className="flex items-baseline gap-1">
                                <span className="font-heading text-xl font-bold text-gray-900 group-hover:text-[#8B6914] transition-colors duration-300">
                                    CHF {product.price.toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-400">{product.priceUnit}</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">HT</span>
                        </div>
                    </div>
                </div>

                {/* Bottom accent bar */}
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-[#8B6914] to-[#c49a2a] transition-all duration-500 ease-out" />
            </Link>
        </motion.div>
    )
}
