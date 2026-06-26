// ============================================================
// SWIFT GOODS — SHOPIFY STOREFRONT API INTEGRATION
// ============================================================

// ============================================================
// TYPE DEFINITIONS
// ============================================================
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
  selectedOptions: Array<{
    name: string
    value: string
  }>
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
  images: {
    nodes: ShopifyImage[]
  }
  variants: {
    nodes: ShopifyVariant[]
  }
  options: Array<{
    id: string
    name: string
    values: string[]
  }>
  seo: {
    title: string | null
    description: string | null
  }
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
  products: {
    nodes: ShopifyProduct[]
  }
  seo: {
    title: string | null
    description: string | null
  }
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
  cost: {
    totalAmount: ShopifyMoneyV2
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: {
    nodes: ShopifyCartLine[]
  }
  cost: {
    subtotalAmount: ShopifyMoneyV2
    totalAmount: ShopifyMoneyV2
    totalTaxAmount: ShopifyMoneyV2 | null
  }
}

// ============================================================
// GRAPHQL FRAGMENTS
// ============================================================
const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`

const MONEY_FRAGMENT = `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`

const VARIANT_FRAGMENT = `
  fragment VariantFragment on ProductVariant {
    id
    title
    availableForSale
    price {
      ...MoneyFragment
    }
    compareAtPrice {
      ...MoneyFragment
    }
    selectedOptions {
      name
      value
    }
    image {
      ...ImageFragment
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    tags
    vendor
    productType
    availableForSale
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    featuredImage {
      ...ImageFragment
    }
    images(first: 8) {
      nodes {
        ...ImageFragment
      }
    }
    variants(first: 20) {
      nodes {
        ...VariantFragment
      }
    }
    options {
      id
      name
      values
    }
    seo {
      title
      description
    }
    createdAt
    updatedAt
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}
`

// ============================================================
// GRAPHQL QUERIES
// ============================================================
const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        ...ProductFragment
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`

const GET_PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`

const GET_COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        descriptionHtml
        image {
          ...ImageFragment
        }
        seo {
          title
          description
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
`

const GET_COLLECTION_QUERY = `
  query GetCollection($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      image {
        ...ImageFragment
      }
      products(first: $first) {
        nodes {
          ...ProductFragment
        }
      }
      seo {
        title
        description
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`

// ============================================================
// SHOPIFY CLIENT
// ============================================================
interface StorefrontClientConfig {
  storeDomain: string
  storefrontAccessToken: string
  apiVersion?: string
}

interface StorefrontResponse<T> {
  data: T
  errors?: Array<{ message: string; locations?: unknown; path?: unknown }>
}

export class StorefrontClient {
  private readonly endpoint: string
  private readonly headers: Record<string, string>

  constructor(config: StorefrontClientConfig) {
    const { storeDomain, storefrontAccessToken, apiVersion = '2025-01' } = config
    this.endpoint = `https://${storeDomain}/api/${apiVersion}/graphql.json`
    this.headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      'Accept': 'application/json',
    }
  }

  async request<T>(
    query: string,
    variables?: Record<string, unknown>,
    options?: { cache?: RequestCache }
  ): Promise<T> {
    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ query, variables }),
    }
    if (options?.cache === 'no-store') {
      fetchOptions.cache = 'no-store'
    } else {
      fetchOptions.next = { revalidate: 60 }
    }
    const response = await fetch(this.endpoint, fetchOptions)

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      console.error(`[Swift Goods] API ${response.status}: ${body}`)
      throw new Error(
        `Shopify Storefront API error: ${response.status} ${response.statusText}`
      )
    }

    const json = (await response.json()) as StorefrontResponse<T>

    if (json.errors && json.errors.length > 0) {
      const errorMessages = json.errors.map((e) => e.message).join(', ')
      throw new Error(`GraphQL errors: ${errorMessages}`)
    }

    return json.data
  }
}

// ============================================================
// CLIENT FACTORY
// ============================================================
let cachedClient: StorefrontClient | null = null

export function createShopifyClient(): StorefrontClient {
  if (cachedClient) return cachedClient

  const storeDomain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN

  const storefrontAccessToken =
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!storeDomain || !storefrontAccessToken) {
    console.warn(
      '[Swift Goods] Shopify env vars not set. Using mock data.'
    )
    // Return a dummy client that will fall back to mock data
    return new StorefrontClient({
      storeDomain: 'placeholder.myshopify.com',
      storefrontAccessToken: 'placeholder',
    })
  }

  cachedClient = new StorefrontClient({ storeDomain, storefrontAccessToken })
  return cachedClient
}

// ============================================================
// API FUNCTIONS
// ============================================================
export async function getProducts(
  first = 12,
  options?: {
    after?: string
    sortKey?: 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'CREATED_AT' | 'RELEVANCE'
    reverse?: boolean
  }
): Promise<ShopifyProduct[]> {
  try {
    const client = createShopifyClient()
    const data = await client.request<{
      products: { nodes: ShopifyProduct[] }
    }>(GET_PRODUCTS_QUERY, {
      first,
      after: options?.after,
      sortKey: options?.sortKey ?? 'CREATED_AT',
      reverse: options?.reverse ?? true,
    })
    return data.products.nodes
  } catch (error) {
    console.error('[Swift Goods] getProducts error:', error)
    return MOCK_PRODUCTS
  }
}

export async function getProduct(
  handle: string
): Promise<ShopifyProduct | null> {
  try {
    const client = createShopifyClient()
    const data = await client.request<{
      productByHandle: ShopifyProduct | null
    }>(GET_PRODUCT_QUERY, { handle })
    return data.productByHandle
  } catch (error) {
    console.error('[Swift Goods] getProduct error:', error)
    return MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null
  }
}

export async function getCollections(
  first = 10
): Promise<ShopifyCollection[]> {
  try {
    const client = createShopifyClient()
    const data = await client.request<{
      collections: { nodes: ShopifyCollection[] }
    }>(GET_COLLECTIONS_QUERY, { first })
    return data.collections.nodes
  } catch (error) {
    console.error('[Swift Goods] getCollections error:', error)
    return []
  }
}

export async function getCollection(
  handle: string,
  productsFirst = 12
): Promise<ShopifyCollection | null> {
  try {
    const client = createShopifyClient()
    const data = await client.request<{
      collectionByHandle: ShopifyCollection | null
    }>(GET_COLLECTION_QUERY, { handle, first: productsFirst })
    return data.collectionByHandle
  } catch (error) {
    console.error('[Swift Goods] getCollection error:', error)
    return null
  }
}

// ============================================================
// CART GRAPHQL FRAGMENTS & MUTATIONS
// ============================================================
const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              ...MoneyFragment
            }
            product {
              id
              handle
              title
              featuredImage {
                ...ImageFragment
              }
            }
            selectedOptions {
              name
              value
            }
          }
        }
        cost {
          totalAmount {
            ...MoneyFragment
          }
        }
      }
    }
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

const CREATE_CART_MUTATION = `
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

const UPDATE_CART_MUTATION = `
  mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`

// ============================================================
// CART API FUNCTIONS
// ============================================================
export async function createCart(
  variantId: string,
  quantity = 1
): Promise<ShopifyCart | null> {
  try {
    const client = createShopifyClient()
    const data = await client.request<{
      cartCreate: { cart: ShopifyCart; userErrors: Array<{ message: string }> }
    }>(CREATE_CART_MUTATION, {
      lines: [{ merchandiseId: variantId, quantity }],
    }, { cache: 'no-store' })
    if (data.cartCreate.userErrors.length > 0) {
      console.error('[Swift Goods] Cart create errors:', data.cartCreate.userErrors)
      return null
    }
    return data.cartCreate.cart
  } catch (error) {
    console.error('[Swift Goods] createCart error:', error)
    return null
  }
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart | null> {
  try {
    const client = createShopifyClient()
    const data = await client.request<{
      cartLinesAdd: { cart: ShopifyCart; userErrors: Array<{ message: string }> }
    }>(ADD_TO_CART_MUTATION, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    }, { cache: 'no-store' })
    if (data.cartLinesAdd.userErrors.length > 0) {
      console.error('[Swift Goods] Add to cart errors:', data.cartLinesAdd.userErrors)
      return null
    }
    return data.cartLinesAdd.cart
  } catch (error) {
    console.error('[Swift Goods] addToCart error:', error)
    return null
  }
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  try {
    const client = createShopifyClient()
    const data = await client.request<{
      cartLinesUpdate: { cart: ShopifyCart; userErrors: Array<{ message: string }> }
    }>(UPDATE_CART_MUTATION, {
      cartId,
      lines: [{ id: lineId, quantity }],
    }, { cache: 'no-store' })
    if (data.cartLinesUpdate.userErrors.length > 0) {
      console.error('[Swift Goods] Update cart errors:', data.cartLinesUpdate.userErrors)
      return null
    }
    return data.cartLinesUpdate.cart
  } catch (error) {
    console.error('[Swift Goods] updateCartLine error:', error)
    return null
  }
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart | null> {
  try {
    const client = createShopifyClient()
    const data = await client.request<{
      cartLinesRemove: { cart: ShopifyCart; userErrors: Array<{ message: string }> }
    }>(REMOVE_FROM_CART_MUTATION, {
      cartId,
      lineIds,
    }, { cache: 'no-store' })
    if (data.cartLinesRemove.userErrors.length > 0) {
      console.error('[Swift Goods] Remove from cart errors:', data.cartLinesRemove.userErrors)
      return null
    }
    return data.cartLinesRemove.cart
  } catch (error) {
    console.error('[Swift Goods] removeFromCart error:', error)
    return null
  }
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    const client = createShopifyClient()
    const data = await client.request<{ cart: ShopifyCart | null }>(
      GET_CART_QUERY,
      { cartId },
      { cache: 'no-store' }
    )
    return data.cart
  } catch (error) {
    console.error('[Swift Goods] getCart error:', error)
    return null
  }
}

// ============================================================
// UTILITY HELPERS
// ============================================================
export function formatPrice(
  amount: string,
  currencyCode = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount))
}

export function getProductUrl(handle: string): string {
  return `/products/${handle}`
}

export function getCollectionUrl(handle: string): string {
  return `/collections/${handle}`
}

export function getAvailableVariants(product: ShopifyProduct): ShopifyVariant[] {
  return product.variants.nodes.filter((v) => v.availableForSale)
}

export function getDefaultVariant(product: ShopifyProduct): ShopifyVariant | null {
  return product.variants.nodes[0] ?? null
}

export function isOnSale(variant: ShopifyVariant): boolean {
  if (!variant.compareAtPrice) return false
  return (
    parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
  )
}

// ============================================================
// MOCK DATA — Luxury Products for development / fallback
// ============================================================
const createMockVariants = (
  priceAmount: string,
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
): ShopifyVariant[] =>
  sizes.map((size, i) => ({
    id: `mock-variant-${Math.random().toString(36).slice(2)}-${i}`,
    title: size,
    availableForSale: i < 4,
    price: { amount: priceAmount, currencyCode: 'USD' },
    compareAtPrice: null,
    selectedOptions: [{ name: 'Size', value: size }],
    image: null,
  }))

export const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'mock-product-001',
    handle: 'the-obsidian-hoodie',
    title: 'The Obsidian Hoodie',
    description:
      'Crafted from 420gsm triple-brushed French terry. The Obsidian Hoodie represents the pinnacle of comfort engineering — a structured yet yielding silhouette designed to inhabit the space between streetwear and haute couture.',
    descriptionHtml:
      '<p>Crafted from 420gsm triple-brushed French terry. The Obsidian Hoodie represents the pinnacle of comfort engineering.</p>',
    tags: ['hoodie', 'heavyweight', 'signature', 'new-arrival'],
    vendor: 'Swift Goods',
    productType: 'Hoodie',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '285.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '285.00', currencyCode: 'USD' },
    },
    featuredImage: {
      id: 'img-001',
      url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
      altText: 'The Obsidian Hoodie',
      width: 800,
      height: 1067,
    },
    images: {
      nodes: [
        {
          id: 'img-001',
          url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
          altText: 'The Obsidian Hoodie — Front',
          width: 800,
          height: 1067,
        },
        {
          id: 'img-001b',
          url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
          altText: 'The Obsidian Hoodie — Detail',
          width: 800,
          height: 1067,
        },
      ],
    },
    variants: { nodes: createMockVariants('285.00') },
    options: [{ id: 'opt-001', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'The Obsidian Hoodie | Swift Goods', description: null },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-002',
    handle: 'chrome-crewneck',
    title: 'Chrome Crewneck',
    description:
      'The Chrome Crewneck redefines essential knitwear with an ultra-heavy 380gsm cotton blend. Oversized through the body with a precision-dropped shoulder and raw-edge interior finishing. A study in refined minimalism.',
    descriptionHtml:
      '<p>The Chrome Crewneck redefines essential knitwear with an ultra-heavy 380gsm cotton blend.</p>',
    tags: ['crewneck', 'heavyweight', 'signature'],
    vendor: 'Swift Goods',
    productType: 'Crewneck',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '225.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '225.00', currencyCode: 'USD' },
    },
    featuredImage: {
      id: 'img-002',
      url: 'https://images.unsplash.com/photo-1586790170083-5d318e8a6a46?w=800&q=80',
      altText: 'Chrome Crewneck',
      width: 800,
      height: 1067,
    },
    images: {
      nodes: [
        {
          id: 'img-002',
          url: 'https://images.unsplash.com/photo-1586790170083-5d318e8a6a46?w=800&q=80',
          altText: 'Chrome Crewneck',
          width: 800,
          height: 1067,
        },
      ],
    },
    variants: { nodes: createMockVariants('225.00') },
    options: [{ id: 'opt-002', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Chrome Crewneck | Swift Goods', description: null },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-003',
    handle: 'void-track-jacket',
    title: 'Void Track Jacket',
    description:
      'The Void Track Jacket merges athletic heritage with avant-garde construction. 4-way stretch technical shell with brushed micro-fleece interior. Engineered seaming creates an architectural silhouette that moves with precision.',
    descriptionHtml:
      '<p>The Void Track Jacket merges athletic heritage with avant-garde construction.</p>',
    tags: ['jacket', 'technical', 'signature', 'bestseller'],
    vendor: 'Swift Goods',
    productType: 'Jacket',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '395.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '395.00', currencyCode: 'USD' },
    },
    featuredImage: {
      id: 'img-003',
      url: 'https://images.unsplash.com/photo-1544022613-78f6e1a79bc1?w=800&q=80',
      altText: 'Void Track Jacket',
      width: 800,
      height: 1067,
    },
    images: {
      nodes: [
        {
          id: 'img-003',
          url: 'https://images.unsplash.com/photo-1544022613-78f6e1a79bc1?w=800&q=80',
          altText: 'Void Track Jacket',
          width: 800,
          height: 1067,
        },
      ],
    },
    variants: { nodes: createMockVariants('395.00') },
    options: [{ id: 'opt-003', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Void Track Jacket | Swift Goods', description: null },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-004',
    handle: 'platinum-jogger',
    title: 'Platinum Jogger',
    description:
      'Constructed from 340gsm heavyweight French terry with precision tapered leg. The Platinum Jogger features a structured waistband system and articulated knee paneling that bridges the gap between performance and luxury.',
    descriptionHtml:
      '<p>Constructed from 340gsm heavyweight French terry with precision tapered leg.</p>',
    tags: ['jogger', 'heavyweight', 'signature'],
    vendor: 'Swift Goods',
    productType: 'Jogger',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '195.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '195.00', currencyCode: 'USD' },
    },
    featuredImage: {
      id: 'img-004',
      url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
      altText: 'Platinum Jogger',
      width: 800,
      height: 1067,
    },
    images: {
      nodes: [
        {
          id: 'img-004',
          url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
          altText: 'Platinum Jogger',
          width: 800,
          height: 1067,
        },
      ],
    },
    variants: { nodes: createMockVariants('195.00') },
    options: [{ id: 'opt-004', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Platinum Jogger | Swift Goods', description: null },
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-005',
    handle: 'phantom-long-tee',
    title: 'Phantom Long Tee',
    description:
      'An extended-length statement tee in 240gsm Supima cotton. The Phantom Long Tee features a raw-hem finish, side-split construction, and an intentionally oversized upper with tapered lower. Minimal branding, maximum presence.',
    descriptionHtml:
      '<p>An extended-length statement tee in 240gsm Supima cotton.</p>',
    tags: ['tee', 'extended', 'essential'],
    vendor: 'Swift Goods',
    productType: 'T-Shirt',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '145.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '145.00', currencyCode: 'USD' },
    },
    featuredImage: {
      id: 'img-005',
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      altText: 'Phantom Long Tee',
      width: 800,
      height: 1067,
    },
    images: {
      nodes: [
        {
          id: 'img-005',
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
          altText: 'Phantom Long Tee',
          width: 800,
          height: 1067,
        },
      ],
    },
    variants: { nodes: createMockVariants('145.00') },
    options: [{ id: 'opt-005', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Phantom Long Tee | Swift Goods', description: null },
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-006',
    handle: 'midnight-cargo-pant',
    title: 'Midnight Cargo Pant',
    description:
      'The Midnight Cargo Pant reinterprets utilitarian design through a luxury lens. Heavyweight canvas construction with concealed magnetic pocket closures, a low-rise straight leg profile, and internal seam taping throughout.',
    descriptionHtml:
      '<p>The Midnight Cargo Pant reinterprets utilitarian design through a luxury lens.</p>',
    tags: ['cargo', 'pants', 'technical', 'bestseller'],
    vendor: 'Swift Goods',
    productType: 'Pants',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '265.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '265.00', currencyCode: 'USD' },
    },
    featuredImage: {
      id: 'img-006',
      url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80',
      altText: 'Midnight Cargo Pant',
      width: 800,
      height: 1067,
    },
    images: {
      nodes: [
        {
          id: 'img-006',
          url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80',
          altText: 'Midnight Cargo Pant',
          width: 800,
          height: 1067,
        },
      ],
    },
    variants: { nodes: createMockVariants('265.00') },
    options: [{ id: 'opt-006', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Midnight Cargo Pant | Swift Goods', description: null },
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-007',
    handle: 'noir-collection-set',
    title: 'Noir Collection Set',
    description:
      'The pinnacle of the Swift Goods lineup — The Noir Collection Set unites the Obsidian Hoodie, Platinum Jogger, and Phantom Long Tee in a curated matching system. Coordinated tonal threading and matched French terry weights create an unbroken visual statement.',
    descriptionHtml:
      '<p>The pinnacle of the Swift Goods lineup — The Noir Collection Set.</p>',
    tags: ['set', 'collection', 'signature', 'limited', 'bestseller'],
    vendor: 'Swift Goods',
    productType: 'Set',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '695.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '695.00', currencyCode: 'USD' },
    },
    featuredImage: {
      id: 'img-007',
      url: 'https://images.unsplash.com/photo-1506015391300-4802dc74f238?w=800&q=80',
      altText: 'Noir Collection Set',
      width: 800,
      height: 1067,
    },
    images: {
      nodes: [
        {
          id: 'img-007',
          url: 'https://images.unsplash.com/photo-1506015391300-4802dc74f238?w=800&q=80',
          altText: 'Noir Collection Set',
          width: 800,
          height: 1067,
        },
      ],
    },
    variants: { nodes: createMockVariants('695.00') },
    options: [{ id: 'opt-007', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'Noir Collection Set | Swift Goods', description: null },
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'mock-product-008',
    handle: 'the-swift-bomber',
    title: 'The Swift Bomber',
    description:
      'Our crown jewel. The Swift Bomber is constructed from a proprietary 3-layer technical shell with quilted Primaloft Gold insulation throughout. Reversible construction reveals a hand-finished satin interior. The definitive luxury statement piece.',
    descriptionHtml:
      '<p>Our crown jewel. The Swift Bomber is constructed from a proprietary 3-layer technical shell.</p>',
    tags: ['bomber', 'jacket', 'signature', 'limited', 'new-arrival'],
    vendor: 'Swift Goods',
    productType: 'Jacket',
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: '485.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '485.00', currencyCode: 'USD' },
    },
    featuredImage: {
      id: 'img-008',
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
      altText: 'The Swift Bomber',
      width: 800,
      height: 1067,
    },
    images: {
      nodes: [
        {
          id: 'img-008',
          url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
          altText: 'The Swift Bomber',
          width: 800,
          height: 1067,
        },
      ],
    },
    variants: { nodes: createMockVariants('485.00') },
    options: [{ id: 'opt-008', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
    seo: { title: 'The Swift Bomber | Swift Goods', description: null },
    createdAt: '2024-04-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
]
