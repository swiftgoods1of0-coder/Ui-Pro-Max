import { NextResponse } from 'next/server'

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'NOT SET'
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'NOT SET'

  const query = `{
    products(first: 3) {
      nodes {
        id handle title description descriptionHtml
        tags vendor productType availableForSale
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        featuredImage { id url altText width height }
        images(first: 8) { nodes { id url altText width height } }
        variants(first: 20) {
          nodes {
            id title availableForSale quantityAvailable
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
            image { id url altText width height }
          }
        }
        options { id name values }
        seo { title description }
        createdAt updatedAt
      }
    }
  }`

  try {
    const response = await fetch(
      `https://${domain}/api/2025-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({ query }),
        cache: 'no-store',
      }
    )

    const status = response.status
    const body = await response.text()

    return NextResponse.json({
      apiStatus: status,
      rawResponse: body.slice(0, 2000),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message })
  }
}
