import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { TrustSignals } from '@/components/landing/TrustSignals'
import { CategoryPreview } from '@/components/landing/CategoryPreview'
import { WhyUs } from '@/components/landing/WhyUs'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col pt-16 lg:pt-20">
      <Navbar />
      <HeroSection />
      <TrustSignals />
      <CategoryPreview />
      <WhyUs />
      <Footer />
    </main>
  )
}
