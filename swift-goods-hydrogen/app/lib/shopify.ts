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

// ── Mock Products (fallback) ──────────────────────────────────────────────────
const createMockVariants = (priceAmount: string, sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']): ShopifyVariant[] =>
  sizes.map((size, i) => ({
    id: `mock-variant-${i}`,
    title: size,
    availableForSale: i < 4,
    price: { amount: priceAmount, currencyCode: 'USD' },
    compareAtPrice: null,
    selectedOptions: [{ name: 'Size', value: size }],
    image: null,
  }))

export const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'mock-product-001', handle: 'the-obsidian-hoodie', title: 'The Obsidian Hoodie',
    description: 'Crafted from 420gsm triple-brushed French terry.', descriptionHtml: '<p>Crafted from 420gsm triple-brushed French terry.</p>',
    tags: ['hoodie', 'heavyweight', 'signature', 'new-arrival'], vendor: 'Swift Goods', productType: 'Hoodie',
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '285.00', currencyCode: 'USD' }, maxVariantPrice: { amount: '285.00', currencyCode: 'USD' } },
    featuredImage: { id: 'img-001', url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80', altText: 'The Obsidian Hoodie', width: 800, height: 1067 },
    images: { nodes: [{ id: 'img-001', url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80', altText: 'The Obsidian Hoodie', width: 800, height: 1067 }] },
    variants: { nodes: createMockVariants('285.00') },
    options: [{ id: 'opt-001', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'The Obsidian Hoodie | Swift Goods', description: null }, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-002', handle: 'chrome-crewneck', title: 'Chrome Crewneck',
    description: 'Ultra-heavy 380gsm cotton blend.', descriptionHtml: '<p>Ultra-heavy 380gsm cotton blend.</p>',
    tags: ['crewneck', 'heavyweight', 'signature'], vendor: 'Swift Goods', productType: 'Crewneck',
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '225.00', currencyCode: 'USD' }, maxVariantPrice: { amount: '225.00', currencyCode: 'USD' } },
    featuredImage: { id: 'img-002', url: 'https://images.unsplash.com/photo-1586790170083-5d318e8a6a46?w=800&q=80', altText: 'Chrome Crewneck', width: 800, height: 1067 },
    images: { nodes: [{ id: 'img-002', url: 'https://images.unsplash.com/photo-1586790170083-5d318e8a6a46?w=800&q=80', altText: 'Chrome Crewneck', width: 800, height: 1067 }] },
    variants: { nodes: createMockVariants('225.00') },
    options: [{ id: 'opt-002', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Chrome Crewneck | Swift Goods', description: null }, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-003', handle: 'void-track-jacket', title: 'Void Track Jacket',
    description: 'Athletic heritage with avant-garde construction.', descriptionHtml: '<p>Athletic heritage with avant-garde construction.</p>',
    tags: ['jacket', 'technical', 'signature', 'bestseller'], vendor: 'Swift Goods', productType: 'Jacket',
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '395.00', currencyCode: 'USD' }, maxVariantPrice: { amount: '395.00', currencyCode: 'USD' } },
    featuredImage: { id: 'img-003', url: 'https://images.unsplash.com/photo-1544022613-78f6e1a79bc1?w=800&q=80', altText: 'Void Track Jacket', width: 800, height: 1067 },
    images: { nodes: [{ id: 'img-003', url: 'https://images.unsplash.com/photo-1544022613-78f6e1a79bc1?w=800&q=80', altText: 'Void Track Jacket', width: 800, height: 1067 }] },
    variants: { nodes: createMockVariants('395.00') },
    options: [{ id: 'opt-003', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Void Track Jacket | Swift Goods', description: null }, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-004', handle: 'platinum-jogger', title: 'Platinum Jogger',
    description: '340gsm heavyweight French terry, precision tapered leg.', descriptionHtml: '<p>340gsm heavyweight French terry.</p>',
    tags: ['jogger', 'heavyweight', 'signature'], vendor: 'Swift Goods', productType: 'Jogger',
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '195.00', currencyCode: 'USD' }, maxVariantPrice: { amount: '195.00', currencyCode: 'USD' } },
    featuredImage: { id: 'img-004', url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80', altText: 'Platinum Jogger', width: 800, height: 1067 },
    images: { nodes: [{ id: 'img-004', url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80', altText: 'Platinum Jogger', width: 800, height: 1067 }] },
    variants: { nodes: createMockVariants('195.00') },
    options: [{ id: 'opt-004', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Platinum Jogger | Swift Goods', description: null }, createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-005', handle: 'phantom-long-tee', title: 'Phantom Long Tee',
    description: 'Extended-length statement tee in 240gsm Supima cotton.', descriptionHtml: '<p>240gsm Supima cotton.</p>',
    tags: ['tee', 'extended', 'essential'], vendor: 'Swift Goods', productType: 'T-Shirt',
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '145.00', currencyCode: 'USD' }, maxVariantPrice: { amount: '145.00', currencyCode: 'USD' } },
    featuredImage: { id: 'img-005', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', altText: 'Phantom Long Tee', width: 800, height: 1067 },
    images: { nodes: [{ id: 'img-005', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', altText: 'Phantom Long Tee', width: 800, height: 1067 }] },
    variants: { nodes: createMockVariants('145.00') },
    options: [{ id: 'opt-005', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Phantom Long Tee | Swift Goods', description: null }, createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-006', handle: 'midnight-cargo-pant', title: 'Midnight Cargo Pant',
    description: 'Utilitarian design through a luxury lens.', descriptionHtml: '<p>Utilitarian design through a luxury lens.</p>',
    tags: ['cargo', 'pants', 'technical', 'bestseller'], vendor: 'Swift Goods', productType: 'Pants',
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '265.00', currencyCode: 'USD' }, maxVariantPrice: { amount: '265.00', currencyCode: 'USD' } },
    featuredImage: { id: 'img-006', url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80', altText: 'Midnight Cargo Pant', width: 800, height: 1067 },
    images: { nodes: [{ id: 'img-006', url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80', altText: 'Midnight Cargo Pant', width: 800, height: 1067 }] },
    variants: { nodes: createMockVariants('265.00') },
    options: [{ id: 'opt-006', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Midnight Cargo Pant | Swift Goods', description: null }, createdAt: '2024-03-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z',
  },
]
