import { getAppBaseUrl } from "@/app/[locale]/lib/get-app-base-url";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const sitemap = `${getAppBaseUrl()}/sitemap.xml`;
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: sitemap,
	};
}
