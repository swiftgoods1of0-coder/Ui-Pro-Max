import { NextResponse } from 'next/server'
import { getCart } from '@/lib/shopify'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cartId = searchParams.get('cartId')

  if (!cartId) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const cart = await getCart(cartId)

  if (!cart?.checkoutUrl) {
    return NextResponse.redirect(new URL('/collections', request.url))
  }

  // Always force checkout to the native myshopify.com domain.
  // Shopify may return the custom domain in checkoutUrl if it's set as primary —
  // that would 404 on the Next.js storefront. This server-side fetch + redirect
  // guarantees the user lands on the real Shopify checkout every time.
  const checkoutUrl = cart.checkoutUrl.replace(
    /^https?:\/\/[^/]+/,
    'https://swiftgoodsclothing.myshopify.com'
  )

  return NextResponse.redirect(checkoutUrl)
}
