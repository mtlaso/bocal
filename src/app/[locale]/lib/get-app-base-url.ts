import { cache } from "react";
import "server-only";

export const getAppBaseURL = cache(() => {
	switch (process.env.VERCEL_ENV) {
		case "production":
			return "https://bocal.fyi";
		case "preview": {
			// https://vercel.com/docs/projects/environment-variables/system-environment-variables#VERCEL_PROJECT_PRODUCTION_URL
			const opt1 = process.env.VERCEL_PROJECT_PRODUCTION_URL;
			const opt2 = process.env.VERCEL_URL;
			const opt3 = process.env.VERCEL_DEPLOYMENT_URL;
			if (opt1) return `https://${opt1}`;
			if (opt2) return `https://${opt2}`;
			return `https://${opt3}`;
		}
		default:
			return `http://localhost:${process.env.PORT}`;
	}
});
