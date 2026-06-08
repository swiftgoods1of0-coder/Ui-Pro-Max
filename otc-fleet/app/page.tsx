import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import Services from './components/Services'
import WhyOTC from './components/WhyOTC'
import Industries from './components/Industries'
import FleetPrograms from './components/FleetPrograms'
import FleetGraphix from './components/FleetGraphix'
import TrailerDepartment from './components/TrailerDepartment'
import SnowEquipment from './components/SnowEquipment'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SectionNav from './components/SectionNav'

export default function Home() {
  return (
    <>
      <SectionNav />
      <Hero />
      <StatsBar />
      <Services />
      <WhyOTC />
      <Industries />
      <FleetPrograms />
      <FleetGraphix />
      <TrailerDepartment />
      <SnowEquipment />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}
