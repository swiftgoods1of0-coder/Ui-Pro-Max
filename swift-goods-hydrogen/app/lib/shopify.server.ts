// ============================================================
// SWIFT GOODS — SERVER-SIDE SHOPIFY QUERIES (Hydrogen)
// These run in Remix loaders via the Hydrogen storefront client.
// ============================================================

import type { Storefront } from '@shopify/hydrogen'

// ── Types (re-exported from shared types file) ──────────────────────────────
export type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyImage,
  ShopifyMoneyV2,
  ShopifyVariant,
} from './shopify'

import type { ShopifyProduct, ShopifyCollection } from './shopify'

// ── GraphQL Fragments ───────────────────────────────────────────────────────
const IMAGE_FRAGMENT = `#graphql
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`

const MONEY_FRAGMENT = `#graphql
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`

const VARIANT_FRAGMENT = `#graphql
  fragment VariantFragment on ProductVariant {
    id
    title
    availableForSale
    price { ...MoneyFragment }
    compareAtPrice { ...MoneyFragment }
    selectedOptions { name value }
    image { ...ImageFragment }
  }
`

const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFragment on Product {
    id handle title description descriptionHtml
    tags vendor productType availableForSale
    priceRange {
      minVariantPrice { ...MoneyFragment }
      maxVariantPrice { ...MoneyFragment }
    }
    featuredImage { ...ImageFragment }
    images(first: 8) { nodes { ...ImageFragment } }
    variants(first: 20) { nodes { ...VariantFragment } }
    options { id name values }
    seo { title description }
    createdAt updatedAt
  }
`

const ALL_PRODUCT_FRAGMENTS = `
  ${PRODUCT_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

// ── Queries ─────────────────────────────────────────────────────────────────
const GET_PRODUCTS_QUERY = `#graphql
  query GetProducts($first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
      nodes { ...ProductFragment }
      pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
    }
  }
  ${ALL_PRODUCT_FRAGMENTS}
`

const GET_PRODUCT_QUERY = `#graphql
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) { ...ProductFragment }
  }
  ${ALL_PRODUCT_FRAGMENTS}
`

const GET_COLLECTIONS_QUERY = `#graphql
  query GetCollections($first: Int!) {
    collections(first: $first) {
      nodes {
        id handle title description descriptionHtml
        image { ...ImageFragment }
        seo { title description }
      }
    }
  }
  ${IMAGE_FRAGMENT}
`

const GET_COLLECTION_QUERY = `#graphql
  query GetCollection($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id handle title description descriptionHtml
      image { ...ImageFragment }
      products(first: $first) { nodes { ...ProductFragment } }
      seo { title description }
    }
  }
  ${ALL_PRODUCT_FRAGMENTS}
`

// ── API Functions (server-side only) ────────────────────────────────────────
export async function getProducts(
  storefront: Storefront,
  first = 12,
  options?: {
    after?: string
    sortKey?: 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'CREATED_AT' | 'RELEVANCE'
    reverse?: boolean
  }
): Promise<ShopifyProduct[]> {
  try {
    const data = await storefront.query<{
      products: { nodes: ShopifyProduct[] }
    }>(GET_PRODUCTS_QUERY, {
      variables: {
        first,
        after: options?.after,
        sortKey: options?.sortKey ?? 'CREATED_AT',
        reverse: options?.reverse ?? true,
      },
      cache: storefront.CacheCustom({ maxAge: 60, staleWhileRevalidate: 60 }),
    })
    return data.products.nodes
  } catch (error) {
    console.error('[Swift Goods] getProducts error:', error)
    return MOCK_PRODUCTS
  }
}

export async function getProduct(
  storefront: Storefront,
  handle: string
): Promise<ShopifyProduct | null> {
  try {
    const data = await storefront.query<{
      productByHandle: ShopifyProduct | null
    }>(GET_PRODUCT_QUERY, {
      variables: { handle },
      cache: storefront.CacheCustom({ maxAge: 60, staleWhileRevalidate: 60 }),
    })
    return data.productByHandle
  } catch (error) {
    console.error('[Swift Goods] getProduct error:', error)
    return MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null
  }
}

export async function getCollections(
  storefront: Storefront,
  first = 10
): Promise<ShopifyCollection[]> {
  try {
    const data = await storefront.query<{
      collections: { nodes: ShopifyCollection[] }
    }>(GET_COLLECTIONS_QUERY, {
      variables: { first },
      cache: storefront.CacheCustom({ maxAge: 60, staleWhileRevalidate: 60 }),
    })
    return data.collections.nodes
  } catch (error) {
    console.error('[Swift Goods] getCollections error:', error)
    return []
  }
}

export async function getCollection(
  storefront: Storefront,
  handle: string,
  productsFirst = 50
): Promise<ShopifyCollection | null> {
  try {
    const data = await storefront.query<{
      collectionByHandle: ShopifyCollection | null
    }>(GET_COLLECTION_QUERY, {
      variables: { handle, first: productsFirst },
      cache: storefront.CacheCustom({ maxAge: 60, staleWhileRevalidate: 60 }),
    })
    return data.collectionByHandle
  } catch (error) {
    console.error('[Swift Goods] getCollection error:', error)
    return null
  }
}

// ── Mock data (fallback when Shopify is unreachable) ─────────────────────────
import { MOCK_PRODUCTS } from './shopify'
