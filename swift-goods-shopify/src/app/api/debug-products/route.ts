import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/shopify'

export const dynamic = 'force-dynamic'

export async function GET() {
  const products = await getProducts(10)
  return NextResponse.json({
    count: products.length,
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN || 'NOT SET',
    tokenSet: !!(process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN),
    products: products.map((p) => ({
      title: p.title,
      handle: p.handle,
      availableForSale: p.availableForSale,
      price: p.priceRange.minVariantPrice.amount,
    })),
  })
}
