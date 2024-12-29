import { cache } from "react";
import "server-only";

export const getAppUrl = cache(() => {
	switch (process.env.VERCEL_ENV) {
		case "production":
			return "https://bocal.vercel.app";
		case "preview":
			// https://vercel.com/docs/projects/environment-variables/system-environment-variables#VERCEL_URL
			return `https://${process.env.VERCEL_URL}`;
		default:
			return `http://localhost:${process.env.PORT}`;
	}
});
