import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BrandingSteps } from '@/components/branding/BrandingSteps'
import { ContactForm } from '@/components/contact/ContactForm'

export default function PersonnalisationPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col pt-20">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full text-center lg:text-left">
                <span className="font-sans text-sm font-semibold text-kraft uppercase tracking-wider block mb-2">
                    Devenez unique
                </span>
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-charcoal leading-tight mb-6">
                    Personnalisez vos Emballages
                </h1>
                <p className="font-sans text-lg text-muted max-w-3xl mx-auto lg:mx-0 leading-relaxed mb-12">
                    Démarquez-vous de la concurrence. Nous imprimons votre propre logo sur une grande sélection de nos produits, garantissant que votre marque est visible lors de chaque livraison ou repas à emporter.
                </p>

                {/* Steps */}
                <div className="relative z-10">
                    <BrandingSteps />
                </div>

                {/* Contact For Branding */}
                <div className="mt-16 mx-auto max-w-xl text-left">
                    <ContactForm type="devis" />
                </div>

            </div>

            <Footer />
        </main>
    )
}
