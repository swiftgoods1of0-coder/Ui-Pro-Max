import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import type { LinksFunction, MetaFunction } from '@remix-run/react'
import { json } from '@shopify/remix-oxygen'
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen'
import appStyles from './styles/app.css?url'
import { CartProvider } from '@/context/CartContext'
import { SmoothScrollProvider } from '@/lib/smooth-scroll'
import ClientEffects from '@/components/ui/ClientEffects'

// ── Fonts ──────────────────────────────────────────────────────────────────
// Imported via CSS @import in app.css to avoid next/font dependency

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap',
  },
  { rel: 'stylesheet', href: appStyles },
]

export const meta: MetaFunction = () => [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { title: 'Swift Goods | Comfort Is Luxury.' },
  {
    name: 'description',
    content:
      'Ultra-premium luxury streetwear. Designed for movement. Built for presence. Swift Goods Clothing Brand.',
  },
]

export async function loader({ context }: LoaderFunctionArgs) {
  const { env } = context
  // Expose public env vars to the browser (storefront token is public by design)
  return json({
    ENV: {
      PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
      PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN,
    },
  })
}

export default function App() {
  const { ENV } = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <style>{`
          :root {
            --font-display: 'Cormorant Garamond';
            --font-impact: 'Bebas Neue';
            --font-body: 'Inter';
          }
        `}</style>
      </head>
      <body>
        <CartProvider>
          <SmoothScrollProvider>
            <Outlet />
            <ClientEffects />
          </SmoothScrollProvider>
        </CartProvider>
        <ScrollRestoration />
        {/* Inject public Shopify env to window for client-side cart operations */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ background: '#050505', color: '#f5f5f5', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '4rem', letterSpacing: '0.2em', color: '#c9a84c' }}>SWIFT GOODS</h1>
        <p style={{ color: '#888' }}>Something went wrong.</p>
        <a href="/" style={{ color: '#c9a84c', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Return Home
        </a>
        <Scripts />
      </body>
    </html>
  )
}
