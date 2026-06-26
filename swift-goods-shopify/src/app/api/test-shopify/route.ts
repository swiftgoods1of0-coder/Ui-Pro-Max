import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/shopify'

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'NOT SET'
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'NOT SET'
  const maskedToken = token === 'NOT SET' ? 'NOT SET' : token.slice(0, 6) + '...' + token.slice(-4)

  try {
    const products = await getProducts(5)
    const isMock = products.some((p) => p.id.startsWith('mock-'))

    return NextResponse.json({
      domain,
      token: maskedToken,
      isMockData: isMock,
      productCount: products.length,
      products: products.map((p) => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        hasImage: !!p.featuredImage?.url,
        price: p.priceRange.minVariantPrice.amount,
      })),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ domain, token: maskedToken, error: message })
  }
}
