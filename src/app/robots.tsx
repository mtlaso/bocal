import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const sitemap = `${process.env.APP_URL}/sitemap.xml`;
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: sitemap,
	};
}
