import { MetadataRoute } from 'next'
import { PROJECTS } from '@/lib/projects'

const BASE = 'https://acrux.studio'

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = PROJECTS.map(p => ({
    url: `${BASE}/work/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...projectPages,
  ]
}
