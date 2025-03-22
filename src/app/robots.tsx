import { getAppBaseURL } from "@/app/[locale]/lib/get-app-base-url";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const sitemap = `${getAppBaseURL()}/sitemap.xml`;
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: sitemap,
	};
}
