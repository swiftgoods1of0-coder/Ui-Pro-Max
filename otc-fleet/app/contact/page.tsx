import PageHero from '../components/PageHero'
import Contact from '../components/Contact'

export const metadata = {
  title: 'Contact | OTC Fleet Services',
  description: 'Contact OTC Fleet Services in Lancaster or Berks County PA. Schedule fleet repair, DOT inspections, trailer service, or request a fleet program consultation.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        subtitle="Call, text, or fill out the form. Our team will respond within one business day."
      />
      <Contact />
    </>
  )
}
