import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { InfluencersSection } from "@/components/influencers-section"
import { Footer } from "@/components/footer"
import { SectionTransition } from "@/components/section-transition"
import { BrandsSection } from "@/components/brands-section"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Navbar />
      <HeroSection />
      <SectionTransition delay={100}>
        <InfluencersSection />
      </SectionTransition>
      <SectionTransition delay={200}>
        <BrandsSection />
      </SectionTransition>
      <SectionTransition delay={300}>
        <Footer />
      </SectionTransition>
    </main>
  )
}
