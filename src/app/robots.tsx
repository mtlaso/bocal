import type { MetadataRoute } from "next";
import { getAppBaseURL } from "@/lib/get-app-base-url";

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
