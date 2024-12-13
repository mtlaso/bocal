import createNextIntlPlugin from "next-intl/plugin";
import { type NextConfig } from "next";

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: undefined,
            hostname: "**"
          },
        ],
      },
    
} satisfies NextConfig;

export default withNextIntl(nextConfig);
