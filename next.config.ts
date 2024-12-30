import createMDX from '@next/mdx'
import createNextIntlPlugin from "next-intl/plugin";
import { type NextConfig } from "next";

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: undefined,
        hostname: "**"
      },
    ],
  },

} satisfies NextConfig;


const withMDX = createMDX({
})

export default withNextIntl(withMDX(nextConfig));
