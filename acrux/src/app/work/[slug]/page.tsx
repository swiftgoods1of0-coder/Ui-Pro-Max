import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PROJECTS } from '@/lib/projects'
import { CaseStudyClient } from './CaseStudyClient'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return PROJECTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = PROJECTS.find(p => p.slug === slug)
  if (!project) return {}
  return {
    title: `${project.title} — ACRUX Case Study`,
    description: project.desc,
    openGraph: {
      title: `${project.title} — ACRUX`,
      description: project.desc,
      type: 'article',
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const project = PROJECTS.find(p => p.slug === slug)
  if (!project) notFound()

  const currentIndex = PROJECTS.findIndex(p => p.slug === slug)
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length]

  return <CaseStudyClient project={project} nextProject={nextProject} />
}
