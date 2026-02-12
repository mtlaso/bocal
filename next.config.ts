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

  reactCompiler: true,

  cacheComponents: true,

  experimental: {
    // Forward browser logs to the terminal for easier debugging
    browserDebugInfoInTerminal: true,

    // Enable support for `global-not-found`, which allows you to more easily define a global 404 page.
    globalNotFound: true,

    turbopackFileSystemCacheForDev: true,
  },
} satisfies NextConfig;

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({});

export default withNextIntl(withMDX(nextConfig));
