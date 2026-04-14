/** Normalizes category ids for URLs, filters, and anchors (matches legacy slugs). */
export function normalizeId(value?: string | null) {
    if (!value) return 'all'
    const normalized = value.trim().toLowerCase().replace(/_/g, '-')
    const aliases: Record<string, string> = {
        pizza: 'snacks',
        'pizza-snacking': 'snacks',
        sacs: 'sacs-sacherie',
        'sacherie-transport': 'sacs-sacherie',
        gobelets: 'gob-vais-jet',
        'boissons-consommables': 'gob-vais-jet',
        papier: 'hygiene-emballages',
        'boucherie-conservation': 'hygiene-emballages',
        repas: 'plats-emporter',
        'barquettes-plats': 'plats-emporter',
    }
    return aliases[normalized] ?? normalized
}

type CategoryRow = { id: string; label: string }

/** Unwrap Supabase embedded `categories` (object or single-element array). */
function joinedCategory(
    embed: { id?: string; label?: string } | { id?: string; label?: string }[] | null | undefined,
) {
    if (!embed) return null
    return Array.isArray(embed) ? embed[0] ?? null : embed
}

/**
 * Stable category key for grouping/filtering: prefer FK join id, then row category_id, then label match.
 */
export function resolveProductCategoryNormId(
    categoryIdFromRow: string | null | undefined,
    categoriesEmbed: unknown,
    allCategories: CategoryRow[],
): string {
    const j = joinedCategory(categoriesEmbed as Parameters<typeof joinedCategory>[0])
    const fromJoin = j?.id
    const fromRow = categoryIdFromRow
    const key = normalizeId(fromJoin ?? fromRow)
    if (key !== 'all') return key
    const lbl = j?.label?.trim()
    if (lbl) {
        const match = allCategories.find((c) => c.label === lbl)
        if (match) return normalizeId(match.id)
    }
    return 'all'
}
