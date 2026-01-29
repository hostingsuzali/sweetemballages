import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Pizza,
  ShoppingBag,
  Coffee,
  FileText,
  Salad,
} from 'lucide-react'

const categories = [
  {
    id: 'pizza',
    name: 'Boîtes à pizza',
    description: 'Cartons kraft et blancs, toutes dimensions',
    icon: Pizza,
    color: 'kraft',
    products: '45+ produits',
  },
  {
    id: 'sacs',
    name: 'Sacs alimentaires',
    description: 'Kraft, bio, sous-vide et papier',
    icon: ShoppingBag,
    color: 'green-accent',
    products: '80+ produits',
  },
  {
    id: 'gobelets',
    name: 'Gobelets & vaisselle',
    description: 'Jetable, compostable et réutilisable',
    icon: Coffee,
    color: 'charcoal',
    products: '60+ produits',
  },
  {
    id: 'papier',
    name: 'Papier & aluminium',
    description: 'Papier alimentaire, alu et film étirable',
    icon: FileText,
    color: 'muted',
    products: '35+ produits',
  },
  {
    id: 'repas',
    name: 'Boîtes repas & salades',
    description: 'Contenants pour plats chauds et froids',
    icon: Salad,
    color: 'green-accent',
    products: '70+ produits',
  },
]

const colorClasses: Record<string, string> = {
  kraft: 'bg-kraft/15 text-kraft',
  'green-accent': 'bg-green-accent/15 text-green-accent',
  charcoal: 'bg-charcoal/10 text-charcoal',
  muted: 'bg-muted/20 text-muted',
}

export function CategoryPreview() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="font-sans text-sm font-semibold text-kraft uppercase tracking-wider">
            Notre catalogue
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mt-3 mb-4">
            Catégories de produits
          </h2>
          <p className="font-sans text-lg text-muted max-w-2xl mx-auto">
            Tout l'emballage alimentaire professionnel dont vous avez besoin, au
            meilleur prix et en stock permanent.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/produits?category=${category.id}`}
                className="group block bg-white rounded-2xl p-6 border border-border-neutral hover:border-kraft hover:shadow-lg transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${colorClasses[category.color]}`}
                >
                  <category.icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-xl font-bold text-charcoal mb-2 group-hover:text-kraft transition-colors">
                  {category.name}
                </h3>
                <p className="font-sans text-muted mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm font-medium text-kraft">
                    {category.products}
                  </span>
                  <ArrowRight className="w-5 h-5 text-kraft transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              to="/produits"
              className="group flex flex-col items-center justify-center h-full min-h-[240px] bg-charcoal rounded-2xl p-6 hover:bg-charcoal/90 transition-colors"
            >
              <div className="w-14 h-14 bg-kraft rounded-xl flex items-center justify-center mb-5">
                <ArrowRight className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                Voir tout le catalogue
              </h3>
              <p className="font-sans text-footer-muted text-center">
                Parcourez nos 500+ références
              </p>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
