import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import WhyUs from '@/components/WhyUs'
import About from '@/components/About'
import Process from '@/components/Process'
import Emergency from '@/components/Emergency'
import Testimonials from '@/components/Testimonials'
import ServiceAreas from '@/components/ServiceAreas'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <About />
        <Process />
        <Emergency />
        <Testimonials />
        <ServiceAreas />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
