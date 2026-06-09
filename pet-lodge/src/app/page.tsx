import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Trust from '@/components/Trust'
import Services from '@/components/Services'
import Experience from '@/components/Experience'
import Gallery from '@/components/Gallery'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Trust />
      <Services />
      <Experience />
      <Gallery />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
