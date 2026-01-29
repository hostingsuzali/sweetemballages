import { Link } from '@tanstack/react-router'
import { BrandingSteps } from '@/components/branding/BrandingSteps'
import { Button } from '@/components/ui/Button'

export function Branding() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Personnalisation de vos emballages
          </h1>
          <p className="font-sans text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Imprimez votre logo sur vos emballages pour renforcer votre image
            de marque. Nous proposons une impression de qualité sur boîtes
            pizza, sacs kraft, gobelets et autres supports adaptés aux métiers
            de bouche.
          </p>
        </div>

        <BrandingSteps />

        <div className="mt-16 p-6 bg-white rounded-xl border border-border-neutral">
          <h2 className="font-heading text-xl font-bold text-charcoal mb-3">
            Boîtes pizza kraft pour pizzerias
          </h2>
          <p className="font-sans text-muted leading-relaxed mb-6">
            Nos boîtes à pizza en kraft sont particulièrement adaptées à la
            personnalisation : surface d'impression large, résistance et aspect
            professionnel. Idéal pour les pizzerias qui souhaitent afficher leur
            logo et leurs coordonnées sur chaque livraison. Quantités adaptées
            aux professionnels, avec possibilité de tarifs dégressifs.
          </p>
          <Link to="/produits?category=pizza">
            <Button variant="primary">Voir les boîtes pizza</Button>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="font-sans text-muted mb-4">
            Besoin d'un devis pour une personnalisation ?
          </p>
          <Link to="/contact">
            <Button variant="secondary">Demander un devis</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
