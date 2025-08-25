# Sharooq.com Blog

A serverless, high-performance blog built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/).

## Features

- **Serverless**: Deploys easily to platforms like Vercel and Netlify.
- **High Performance**: Optimized for fast load times and SEO.
- **TypeScript**: Type-safe codebase for reliability and maintainability.
- **Next.js**: Uses static generation and server-side rendering for best-in-class performance.
- **Ghost CMS Integration**: Content managed via [Ghost](https://ghost.org/).
- **Responsive Design**: Works great on all devices.
- **Image Optimization**: Uses Next.js image optimization and custom loaders for static export.
- **Modern Tooling**: Includes ESLint, Prettier, and EditorConfig for code quality and consistency.

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- Yarn or npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/sharooqsalaudeen/sharooq-com.git
   cd sharooq-com
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.local.example` to `.env.local` and fill in your Ghost CMS API credentials and site settings.

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

### Building for Production

To build and start the production server:

```sh
npm run build
npm start
```

To generate a static export (for Netlify, etc.):

```sh
npm run export
```

## Project Structure

- `pages/` — Next.js pages (routes)
- `components/` — React components
- `lib/` — Data fetching, Ghost API integration, utilities
- `public/` — Static assets (images, favicon, etc.)
- `styles/` — CSS and PostCSS files
- `utils/` — Utility functions

## Deployment

- **Vercel**: Push to your GitHub repository and import into Vercel.
- **Netlify**: Use the static export (`npm run export`) and deploy the `out/` directory.

## License

This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ using Next.js, TypeScript, and Ghost CMS.