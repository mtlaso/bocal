import { getAppUrl } from "@/app/[locale]/lib/get-app-url";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const sitemap = `${getAppUrl()}/sitemap.xml`;
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: sitemap,
	};
}
