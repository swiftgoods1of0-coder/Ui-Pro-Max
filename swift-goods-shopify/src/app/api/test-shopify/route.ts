import { NextResponse } from 'next/server'

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'NOT SET'
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'NOT SET'
  const maskedToken = token === 'NOT SET' ? 'NOT SET' : token.slice(0, 6) + '...' + token.slice(-4)

  if (domain === 'NOT SET' || token === 'NOT SET') {
    return NextResponse.json({ domain, token: maskedToken, error: 'ENV VARS NOT SET' })
  }

  const endpoint = `https://${domain}/api/2025-01/graphql.json`

  const query = `
    query TestProducts {
      products(first: 3) {
        nodes {
          id
          title
          handle
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
          }
        }
      }
    }
  `

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    })

    const statusCode = response.status
    const body = await response.text()

    let parsed
    try {
      parsed = JSON.parse(body)
    } catch {
      return NextResponse.json({
        domain,
        token: maskedToken,
        statusCode,
        rawBody: body.slice(0, 500),
        error: 'Response is not JSON',
      })
    }

    if (parsed.errors) {
      return NextResponse.json({
        domain,
        token: maskedToken,
        statusCode,
        graphqlErrors: parsed.errors,
        error: parsed.errors.map((e: { message: string }) => e.message).join(', '),
      })
    }

    const products = parsed.data?.products?.nodes ?? []

    return NextResponse.json({
      domain,
      token: maskedToken,
      statusCode,
      isMockData: false,
      productCount: products.length,
      products: products.map((p: { id: string; title: string; handle: string; featuredImage?: { url: string }; priceRange: { minVariantPrice: { amount: string } } }) => ({
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
