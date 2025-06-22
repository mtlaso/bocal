import { cache } from "react";

export const getAppBaseURL = cache(() => {
	// https://vercel.com/docs/environment-variables/framework-environment-variables
	switch (process.env.NEXT_PUBLIC_VERCEL_ENV) {
		case "production":
			return "https://bocal.fyi";
		case "preview": {
			return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
		}
		default:
			return "http://localhost:3000";
	}
});
