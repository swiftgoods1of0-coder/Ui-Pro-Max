// ============================================================
// SWIFT GOODS — SHARED TYPES + CLIENT-SIDE CART API
// Types are shared between server and client.
// Cart mutations run client-side using the public storefront token
// (Shopify's Storefront API is designed to be called from the browser).
// ============================================================

// ── Types ────────────────────────────────────────────────────────────────────
export interface ShopifyImage {
  id: string
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyMoneyV2 {
  amount: string
  currencyCode: string
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoneyV2
  maxVariantPrice: ShopifyMoneyV2
}

export interface ShopifyVariant {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyMoneyV2
  compareAtPrice: ShopifyMoneyV2 | null
  selectedOptions: Array<{ name: string; value: string }>
  image: ShopifyImage | null
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  tags: string[]
  vendor: string
  productType: string
  availableForSale: boolean
  priceRange: ShopifyPriceRange
  featuredImage: ShopifyImage | null
  images: { nodes: ShopifyImage[] }
  variants: { nodes: ShopifyVariant[] }
  options: Array<{ id: string; name: string; values: string[] }>
  seo: { title: string | null; description: string | null }
  createdAt: string
  updatedAt: string
}

export interface ShopifyCollection {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  image: ShopifyImage | null
  products: { nodes: ShopifyProduct[] }
  seo: { title: string | null; description: string | null }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: ShopifyMoneyV2
    product: Pick<ShopifyProduct, 'id' | 'handle' | 'title' | 'featuredImage'>
    selectedOptions: Array<{ name: string; value: string }>
  }
  cost: { totalAmount: ShopifyMoneyV2 }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: { nodes: ShopifyCartLine[] }
  cost: {
    subtotalAmount: ShopifyMoneyV2
    totalAmount: ShopifyMoneyV2
    totalTaxAmount: ShopifyMoneyV2 | null
  }
}

// ── Cart GraphQL Fragments ────────────────────────────────────────────────────
const MONEY_FRAGMENT = `
  fragment MoneyFragment on MoneyV2 { amount currencyCode }
`

const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image { id url altText width height }
`

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id checkoutUrl totalQuantity
    lines(first: 100) {
      nodes {
        id quantity
        merchandise {
          ... on ProductVariant {
            id title
            price { ...MoneyFragment }
            product { id handle title featuredImage { ...ImageFragment } }
            selectedOptions { name value }
          }
        }
        cost { totalAmount { ...MoneyFragment } }
      }
    }
    cost {
      subtotalAmount { ...MoneyFragment }
      totalAmount { ...MoneyFragment }
      totalTaxAmount { ...MoneyFragment }
    }
  }
`

const ALL_CART_FRAGMENTS = `${CART_FRAGMENT} ${MONEY_FRAGMENT} ${IMAGE_FRAGMENT}`

const CREATE_CART_MUTATION = `
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
  ${ALL_CART_FRAGMENTS}
`

const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
  ${ALL_CART_FRAGMENTS}
`

const UPDATE_CART_MUTATION = `
  mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
  ${ALL_CART_FRAGMENTS}
`

const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
  ${ALL_CART_FRAGMENTS}
`

const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFragment }
  }
  ${ALL_CART_FRAGMENTS}
`

// ── Client-side Shopify API (uses public storefront token from window.ENV) ───
function getShopifyEndpoint(): { url: string; token: string } | null {
  if (typeof window === 'undefined') return null
  const ENV = (window as unknown as { ENV?: { PUBLIC_STORE_DOMAIN?: string; PUBLIC_STOREFRONT_API_TOKEN?: string } }).ENV
  if (!ENV?.PUBLIC_STORE_DOMAIN || !ENV?.PUBLIC_STOREFRONT_API_TOKEN) return null
  return {
    url: `https://${ENV.PUBLIC_STORE_DOMAIN}/api/2025-01/graphql.json`,
    token: ENV.PUBLIC_STOREFRONT_API_TOKEN,
  }
}

interface StorefrontResponse<T> {
  data: T
  errors?: Array<{ message: string }>
}

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  const endpoint = getShopifyEndpoint()
  if (!endpoint) {
    console.warn('[Swift Goods] Shopify env not available on client')
    return null
  }

  try {
    const res = await fetch(endpoint.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': endpoint.token,
      },
      body: JSON.stringify({ query, variables }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json: StorefrontResponse<T> = await res.json()
    if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(', '))
    return json.data
  } catch (err) {
    console.error('[Swift Goods] storefrontFetch error:', err)
    return null
  }
}

// ── Cart API Functions (client-side only) ─────────────────────────────────────
export async function createCart(variantId: string, quantity = 1): Promise<ShopifyCart | null> {
  const data = await storefrontFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: Array<{ message: string }> }
  }>(CREATE_CART_MUTATION, { lines: [{ merchandiseId: variantId, quantity }] })
  return data?.cartCreate?.cart ?? null
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<ShopifyCart | null> {
  const data = await storefrontFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: Array<{ message: string }> }
  }>(ADD_TO_CART_MUTATION, { cartId, lines: [{ merchandiseId: variantId, quantity }] })
  return data?.cartLinesAdd?.cart ?? null
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart | null> {
  const data = await storefrontFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: Array<{ message: string }> }
  }>(UPDATE_CART_MUTATION, { cartId, lines: [{ id: lineId, quantity }] })
  return data?.cartLinesUpdate?.cart ?? null
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart | null> {
  const data = await storefrontFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: Array<{ message: string }> }
  }>(REMOVE_FROM_CART_MUTATION, { cartId, lineIds })
  return data?.cartLinesRemove?.cart ?? null
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await storefrontFetch<{ cart: ShopifyCart | null }>(GET_CART_QUERY, { cartId })
  return data?.cart ?? null
}

// ── Utility Helpers ───────────────────────────────────────────────────────────
export function formatPrice(amount: string, currencyCode = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount))
}

export function getProductUrl(handle: string): string { return `/products/${handle}` }
export function getCollectionUrl(handle: string): string { return `/collections/${handle}` }
export function getAvailableVariants(product: ShopifyProduct): ShopifyVariant[] {
  return product.variants.nodes.filter((v) => v.availableForSale)
}
export function getDefaultVariant(product: ShopifyProduct): ShopifyVariant | null {
  return product.variants.nodes[0] ?? null
}
export function isOnSale(variant: ShopifyVariant): boolean {
  if (!variant.compareAtPrice) return false
  return parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
}

