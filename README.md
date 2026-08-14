# MOTION.X

Affiliate marketing website for AI tools and marketing software.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Content**: Static data files (no database)
- **Deployment**: AWS Amplify
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
  app/           - Pages (App Router)
  components/    - Reusable UI components
  data/          - Product and category data (single source of truth)
```

## Adding Products

Edit `src/data/products.ts` to add new products. The data file is the single source of truth for all product information including affiliate links.

## Deployment (AWS Amplify)

1. Push to GitHub
2. Connect repository in AWS Amplify Console
3. Set build settings for Next.js
4. Deploy

## Environment Variables

Set in Amplify Console (not in code):
- `NEXT_PUBLIC_SITE_URL` - Production URL

## Architecture

```
USER -> MOTION.X (Next.js on Amplify) -> Product Pages -> Affiliate Links -> Merchant
```

No database. No auth. No admin panel. Pure content site optimized for SEO and conversions.
