import { getProduct, getProducts } from '@/lib/shopify'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductPageClient from './ProductPageClient'

export const revalidate = 60

interface PageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) notFound()
  return <ProductPageClient product={product} />
}
