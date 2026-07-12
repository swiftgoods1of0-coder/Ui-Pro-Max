import {
  createRequestHandler,
  getStorefrontHeaders,
  type AppLoadContext,
} from '@shopify/remix-oxygen'
import {
  createStorefrontClient,
  storefrontRedirect,
} from '@shopify/hydrogen'
import * as remixBuild from 'virtual:remix/server-build'

// Cloudflare Worker env bindings
interface Env {
  PUBLIC_STORE_DOMAIN: string
  PUBLIC_STOREFRONT_API_TOKEN: string
  PRIVATE_STOREFRONT_API_TOKEN?: string
  PUBLIC_STOREFRONT_ID?: string
  SESSION_SECRET: string
}

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const { storefront } = createStorefrontClient({
        cache: await caches.open('hydrogen'),
        waitUntil: (p) => executionContext.waitUntil(p),
        i18n: { language: 'EN', country: 'US' },
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      })

      const loadContext: AppLoadContext = {
        env,
        storefront,
        session: null as unknown as import('@shopify/hydrogen').HydrogenSession,
      }

      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => loadContext,
      })

      const response = await handleRequest(request)

      if (response.status === 404) {
        return storefrontRedirect({ request, response, storefront })
      }

      return response
    } catch (error) {
      console.error('[Swift Goods] Worker error:', error)
      return new Response('An unexpected error occurred', { status: 500 })
    }
  },
}
