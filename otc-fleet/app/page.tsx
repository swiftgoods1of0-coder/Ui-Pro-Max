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
import SectionDivider from './components/SectionDivider'

export default function Home() {
  return (
    <>
      <SectionNav />
      <Hero />
      <StatsBar />
      <SectionDivider number="01" label="Services" />
      <Services />
      <SectionDivider number="02" label="Why OTC" dark />
      <WhyOTC />
      <SectionDivider number="03" label="Industries We Serve" />
      <Industries />
      <SectionDivider number="04" label="Fleet Programs" dark />
      <FleetPrograms />
      <SectionDivider number="05" label="Fleet Graphix" />
      <FleetGraphix />
      <SectionDivider number="06" label="Trailer Department" dark />
      <TrailerDepartment />
      <SectionDivider number="07" label="Snow Equipment" />
      <SnowEquipment />
      <SectionDivider number="08" label="Testimonials" dark />
      <Testimonials />
      <SectionDivider number="09" label="Contact Us" />
      <Contact />
      <Footer />
    </>
  )
}
