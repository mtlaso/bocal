import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import { type NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: undefined,
        hostname: "**",
      },
    ],
  },
  experimental: {
    // Forward browser logs to the terminal for easier debugging
    browserDebugInfoInTerminal: true,

    // Enable new caching and pre-rendering behavior
    // dynamicIO: true, // will be renamed to cacheComponents in Next.js 16
    ppr: "incremental",

    // Activate new client-side router improvements
    clientSegmentCache: true,

    // Explore route composition and segment overrides via DevTools
    devtoolSegmentExplorer: true,

    // Enable support for `global-not-found`, which allows you to more easily define a global 404 page.
    globalNotFound: true,

    // Enable persistent caching for the turbopack dev server and build.
    turbopackPersistentCaching: true,
  },
} satisfies NextConfig;

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({});

export default withNextIntl(withMDX(nextConfig));
