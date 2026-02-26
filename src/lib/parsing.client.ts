"use client";

/**
 * readableUrl retourne une URL lisible. Retirer le 'www.' ou le 'http(s)://'.
 */
const readableUrl = (url: string): string => {
	const parsedURL = URL.parse(url);
	if (parsedURL) {
		if (parsedURL.hostname.startsWith("www.")) {
			return parsedURL.hostname.slice(4);
		}

		return parsedURL.hostname;
	}

	return url;
};

/**
 * parser contient les fonctions de parse.
 */
export const parsing = {
	readableUrl,
};
