import ScrollProgress from '@/components/ui/ScrollProgress'
import FloatingCTA from '@/components/ui/FloatingCTA'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import TrustStats from '@/components/TrustStats'
import Services from '@/components/Services'
import WhyChooseUs from '@/components/WhyChooseUs'
import Projects from '@/components/Projects'
import Testimonials from '@/components/Testimonials'
import ServiceAreas from '@/components/ServiceAreas'
import Process from '@/components/Process'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <FloatingCTA />
      <Navigation />
      <main>
        <Hero />
        <TrustStats />
        <Services />
        <WhyChooseUs />
        <Projects />
        <Testimonials />
        <Process />
        <ServiceAreas />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
