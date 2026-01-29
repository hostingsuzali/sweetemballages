import { HeroSection } from '@/components/landing/HeroSection'
import { TrustSignals } from '@/components/landing/TrustSignals'
import { CategoryPreview } from '@/components/landing/CategoryPreview'
import { WhyUs } from '@/components/landing/WhyUs'

export function Home() {
  return (
    <>
      <HeroSection />
      <TrustSignals />
      <CategoryPreview />
      <WhyUs />
    </>
  )
}
