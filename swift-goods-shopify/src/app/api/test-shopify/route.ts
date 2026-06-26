import { NextResponse } from 'next/server'

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'NOT SET'
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'NOT SET'
  const maskedToken = token === 'NOT SET' ? 'NOT SET' : token.slice(0, 6) + '...' + token.slice(-4)

  try {
    const response = await fetch(
      `https://${domain}/api/2025-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({
          query: `{ products(first: 3) { nodes { title handle } } }`,
        }),
        cache: 'no-store',
      }
    )

    const status = response.status
    const body = await response.text()

    return NextResponse.json({
      domain,
      token: maskedToken,
      apiStatus: status,
      apiResponse: body.slice(0, 1000),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({
      domain,
      token: maskedToken,
      error: message,
    })
  }
}
