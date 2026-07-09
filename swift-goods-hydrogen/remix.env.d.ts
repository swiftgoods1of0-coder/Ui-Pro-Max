/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

// Declare local additions to the Remix namespace
declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    env: Env
    storefront: import('@shopify/hydrogen').Storefront
    session: import('@shopify/hydrogen').HydrogenSession
  }
}
