# Powell Renovations — Deployment Guide

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# → Open http://localhost:3000
```

## Before You Deploy

1. **Add your images** — see `public/images/IMAGES-NEEDED.md`
2. **Add your logo** — save as `public/logo.png` (transparent PNG)
3. **Update contact info** in these files:
   - `src/app/layout.tsx` — phone, address (line ~28)
   - `src/components/Navigation.tsx` — phone number (line ~79)
   - `src/components/ui/FloatingCTA.tsx` — phone number (line ~27)
   - `src/components/CTA.tsx` — phone + email (lines ~74–83)
   - `src/components/Footer.tsx` — phone + email + address (lines ~56–68)
4. **Update metadata** — in `src/app/layout.tsx` change the site URL from `https://powellrenovations.com` to your actual domain

## Deploy to Vercel (Recommended — Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: powell-renovations
# - Root directory: ./ (press Enter)
# - Build command: npm run build (press Enter)
# - Output directory: .next (press Enter)
```

### Custom Domain on Vercel
1. Go to vercel.com → your project → Settings → Domains
2. Add `powellrenovations.com` (or whatever domain you own)
3. Update your domain registrar DNS to point to Vercel

## Deploy to Netlify (Alternative)

```bash
npm run build
# Upload the `.next` folder to Netlify, or connect your GitHub repo
```

## Environment Variables (Optional)
If you add a form backend (e.g., Resend, SendGrid, Formspree):
```
NEXT_PUBLIC_SITE_URL=https://powellrenovations.com
RESEND_API_KEY=your_api_key_here
```

## Form Backend
The contact form currently logs submissions to the console (development only).
To make it send real emails, replace the `onSubmit` handler in
`src/components/CTA.tsx` with a fetch call to your API route.

See `src/app/api/contact/route.ts` (add this file) to handle form POSTs server-side.

## Performance Notes
- Lighthouse target: 95+ Performance, 100 Accessibility, 100 SEO
- All images are lazy-loaded below the fold
- Fonts load via Google Fonts CDN with preconnect hints
- The build output is optimized for edge deployment on Vercel
