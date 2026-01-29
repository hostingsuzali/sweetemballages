export interface Product {
  id: string
  name: string
  category: string
  dimensions: string
  packaging: string
  price: number
  priceUnit: string
  customizable: boolean
  usage: string[]
  description?: string
  minOrderQty?: number
}

export const CATEGORIES = [
  { id: 'all', label: 'Tous les produits' },
  { id: 'pizza', label: 'Boîtes à pizza' },
  { id: 'sacs', label: 'Sacs alimentaires' },
  { id: 'gobelets', label: 'Gobelets & vaisselle' },
  { id: 'papier', label: 'Papier & aluminium' },
  { id: 'repas', label: 'Boîtes repas & salades' },
] as const

export const USAGES = [
  { id: 'all', label: 'Tous usages' },
  { id: 'pizza', label: 'Pizzeria' },
  { id: 'boucherie', label: 'Boucherie' },
  { id: 'fruits-legumes', label: 'Fruits & légumes' },
  { id: 'traiteur', label: 'Traiteur' },
  { id: 'restaurant', label: 'Restaurant' },
] as const

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'pizza-kraft-26',
    name: 'Boîte pizza kraft 26 cm',
    category: 'pizza',
    dimensions: '26 x 26 x 3 cm',
    packaging: '25 pièces',
    price: 18.5,
    priceUnit: 'pièce',
    customizable: true,
    usage: ['pizza', 'restaurant'],
    minOrderQty: 100,
  },
  {
    id: 'pizza-kraft-32',
    name: 'Boîte pizza kraft 32 cm',
    category: 'pizza',
    dimensions: '32 x 32 x 4 cm',
    packaging: '25 pièces',
    price: 24.0,
    priceUnit: 'pièce',
    customizable: true,
    usage: ['pizza', 'restaurant'],
    minOrderQty: 100,
  },
  {
    id: 'pizza-blanche-26',
    name: 'Boîte pizza blanche 26 cm',
    category: 'pizza',
    dimensions: '26 x 26 x 3 cm',
    packaging: '25 pièces',
    price: 22.0,
    priceUnit: 'pièce',
    customizable: true,
    usage: ['pizza', 'restaurant'],
    minOrderQty: 100,
  },
  {
    id: 'sac-kraft-30x40',
    name: 'Sacs kraft alimentaires 30 x 40 cm',
    category: 'sacs',
    dimensions: '30 x 40 cm',
    packaging: '500 pièces',
    price: 45.0,
    priceUnit: 'paquet',
    customizable: true,
    usage: ['boucherie', 'traiteur', 'restaurant'],
    minOrderQty: 500,
  },
  {
    id: 'sac-sous-vide-20x30',
    name: 'Sacs sous-vide 20 x 30 cm',
    category: 'sacs',
    dimensions: '20 x 30 cm',
    packaging: '100 pièces',
    price: 28.0,
    priceUnit: 'paquet',
    customizable: false,
    usage: ['boucherie', 'traiteur'],
    minOrderQty: 100,
  },
  {
    id: 'sac-bio-m',
    name: 'Sacs biodégradables M',
    category: 'sacs',
    dimensions: '25 x 35 cm',
    packaging: '200 pièces',
    price: 38.0,
    priceUnit: 'paquet',
    customizable: false,
    usage: ['fruits-legumes', 'restaurant', 'traiteur'],
    minOrderQty: 200,
  },
  {
    id: 'gobelet-eco-12cl',
    name: 'Gobelet kraft 12 cl',
    category: 'gobelets',
    dimensions: 'Ø 5.5 cm, H 6 cm',
    packaging: '100 pièces',
    price: 12.5,
    priceUnit: 'pièce',
    customizable: true,
    usage: ['restaurant', 'traiteur'],
    minOrderQty: 200,
  },
  {
    id: 'gobelet-eco-20cl',
    name: 'Gobelet kraft 20 cl',
    category: 'gobelets',
    dimensions: 'Ø 6 cm, H 8 cm',
    packaging: '100 pièces',
    price: 14.0,
    priceUnit: 'pièce',
    customizable: true,
    usage: ['restaurant', 'traiteur'],
    minOrderQty: 200,
  },
  {
    id: 'assiette-jetable-26cm',
    name: 'Assiette jetable 26 cm',
    category: 'gobelets',
    dimensions: '26 cm',
    packaging: '50 pièces',
    price: 18.0,
    priceUnit: 'paquet',
    customizable: false,
    usage: ['restaurant', 'traiteur'],
    minOrderQty: 50,
  },
  {
    id: 'papier-alu-30cm',
    name: 'Papier aluminium 30 cm x 10 m',
    category: 'papier',
    dimensions: '30 cm x 10 m',
    packaging: '12 rouleaux',
    price: 32.0,
    priceUnit: 'carton',
    customizable: false,
    usage: ['boucherie', 'restaurant', 'traiteur'],
    minOrderQty: 12,
  },
  {
    id: 'papier-sulfurise-40cm',
    name: 'Papier sulfurisé 40 cm x 20 m',
    category: 'papier',
    dimensions: '40 cm x 20 m',
    packaging: '6 rouleaux',
    price: 28.0,
    priceUnit: 'carton',
    customizable: false,
    usage: ['restaurant', 'traiteur', 'pizza'],
    minOrderQty: 6,
  },
  {
    id: 'film-etirable-30cm',
    name: 'Film étirable alimentaire 30 cm',
    category: 'papier',
    dimensions: '30 cm x 300 m',
    packaging: '6 rouleaux',
    price: 42.0,
    priceUnit: 'carton',
    customizable: false,
    usage: ['boucherie', 'restaurant', 'traiteur'],
    minOrderQty: 6,
  },
  {
    id: 'boite-repas-1compartiment',
    name: 'Boîte repas 1 compartiment',
    category: 'repas',
    dimensions: '25 x 18 x 5 cm',
    packaging: '50 pièces',
    price: 35.0,
    priceUnit: 'paquet',
    customizable: true,
    usage: ['restaurant', 'traiteur'],
    minOrderQty: 50,
  },
  {
    id: 'boite-repas-3compartiments',
    name: 'Boîte repas 3 compartiments',
    category: 'repas',
    dimensions: '25 x 18 x 5 cm',
    packaging: '50 pièces',
    price: 42.0,
    priceUnit: 'paquet',
    customizable: true,
    usage: ['restaurant', 'traiteur'],
    minOrderQty: 50,
  },
  {
    id: 'salade-kraft-500ml',
    name: 'Barquette salade kraft 500 ml',
    category: 'repas',
    dimensions: '15 x 12 x 8 cm',
    packaging: '50 pièces',
    price: 28.0,
    priceUnit: 'paquet',
    customizable: false,
    usage: ['restaurant', 'traiteur', 'fruits-legumes'],
    minOrderQty: 50,
  },
  {
    id: 'pizza-kraft-36',
    name: 'Boîte pizza kraft 36 cm',
    category: 'pizza',
    dimensions: '36 x 36 x 4 cm',
    packaging: '25 pièces',
    price: 28.5,
    priceUnit: 'pièce',
    customizable: true,
    usage: ['pizza', 'restaurant'],
    minOrderQty: 100,
  },
  {
    id: 'sac-kraft-40x50',
    name: 'Sacs kraft 40 x 50 cm',
    category: 'sacs',
    dimensions: '40 x 50 cm',
    packaging: '500 pièces',
    price: 58.0,
    priceUnit: 'paquet',
    customizable: true,
    usage: ['boucherie', 'traiteur', 'restaurant'],
    minOrderQty: 500,
  },
  {
    id: 'gobelet-plastique-25cl',
    name: 'Gobelet PET 25 cl',
    category: 'gobelets',
    dimensions: 'Ø 7 cm, H 10 cm',
    packaging: '100 pièces',
    price: 8.5,
    priceUnit: 'pièce',
    customizable: true,
    usage: ['restaurant', 'traiteur'],
    minOrderQty: 200,
  },
]

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id)
}

export function filterProducts(
  category: string,
  usage: string
): Product[] {
  return MOCK_PRODUCTS.filter((p) => {
    const matchCategory =
      category === 'all' || p.category === category
    const matchUsage =
      usage === 'all' || p.usage.includes(usage)
    return matchCategory && matchUsage
  })
}
