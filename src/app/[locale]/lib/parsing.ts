import DOMPurify from "isomorphic-dompurify";

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
 * sanitizeHTML retire les balises HTML non autorisées.
 */
function sanitizeHTML(html: string): string {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			"html",
			"head",
			"body",
			"div",
			"span",
			"section",
			"article",
			"header",
			"footer",
			"nav",
			"main",
			"aside",
			"ul",
			"ol",
			"li",
			"dl",
			"dt",
			"dd",
			"table",
			"thead",
			"tbody",
			"tfoot",
			"tr",
			"th",
			"td",
			"p",
			"a",
			"b",
			"i",
			"em",
			"strong",
			"br",
			"img",
			"figure",
			"figcaption",
			"video",
			"audio",
		],
		ALLOWED_ATTR: ["href", "src", "alt", "width", "height"],
	});
}

/**
 * parser contient les fonctions de parse.
 */
export const parsing = {
	readableUrl,
	sanitizeHTML,
};
