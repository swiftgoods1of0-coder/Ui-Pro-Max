import { ClientScene } from '@/components/ClientScene'
import { Loader } from '@/components/Loader'
import { FloatingCTA } from '@/components/FloatingCTA'
import { SmoothScroll } from '@/components/SmoothScroll'
import { Cursor } from '@/components/Cursor'
import { ScrollProgress } from '@/components/ScrollProgress'
import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { LogoStrip } from '@/components/LogoStrip'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { Process } from '@/components/Process'
import { Portfolio } from '@/components/Portfolio'
import { Stats } from '@/components/Stats'
import { WhyAcrux } from '@/components/WhyAcrux'
import { FAQ } from '@/components/FAQ'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Loader />
      <ClientScene />
      <Cursor />
      <ScrollProgress />
      <FloatingCTA />

      <SmoothScroll>
        <Navigation />
        <main>
          <Hero />
          <LogoStrip />
          <About />
          <Services />
          <Process />
          <Portfolio />
          <Stats />
          <WhyAcrux />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}
