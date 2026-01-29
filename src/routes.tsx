import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { Home } from '@/pages/Home'
import { Products } from '@/pages/Products'
import { ProductDetail } from '@/pages/ProductDetail'
import { Branding } from '@/pages/Branding'
import { Contact } from '@/pages/Contact'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const produitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'produits',
  component: Products,
  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as string) ?? 'all',
    usage: (search.usage as string) ?? 'all',
  }),
})

const productIdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'produits/$productId',
  component: ProductDetail,
})

const personnalisationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'personnalisation',
  component: Branding,
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'contact',
  component: Contact,
})

/* prettier-ignore */
const routeTree = rootRoute.addChildren([
  indexRoute,
  produitsRoute,
  productIdRoute,
  personnalisationRoute,
  contactRoute,
])

export const router = createRouter({ routeTree })
