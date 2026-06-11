import { ClientScene } from '@/components/ClientScene'
import { Loader } from '@/components/Loader'
import { FloatingCTA } from '@/components/FloatingCTA'
import { SmoothScroll } from '@/components/SmoothScroll'
import { Cursor } from '@/components/Cursor'
import { ScrollProgress } from '@/components/ScrollProgress'
import { ScrollVelocityBlur } from '@/components/ScrollVelocityBlur'
import { SectionGlow } from '@/components/SectionGlow'
import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { PressStrip } from '@/components/PressStrip'
import { LogoStrip } from '@/components/LogoStrip'
import { About } from '@/components/About'
import { Team } from '@/components/Team'
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
      <ScrollVelocityBlur />
      <SectionGlow />
      <FloatingCTA />

      <SmoothScroll>
        <Navigation />
        <main>
          <Hero />
          <PressStrip />
          <LogoStrip />
          <About />
          <Team />
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
