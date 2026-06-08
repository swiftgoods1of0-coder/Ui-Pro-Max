import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import WhyUs from '@/components/WhyUs'
import Process from '@/components/Process'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import BookCTA from '@/components/BookCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <About />
      <Services />
      <WhyUs />
      <Process />
      <Testimonials />
      <FAQ />
      <BookCTA />
      <Footer />
    </main>
  )
}
