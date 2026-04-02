/** Normalizes category ids for URLs, filters, and anchors (matches legacy slugs). */
export function normalizeId(value?: string) {
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
