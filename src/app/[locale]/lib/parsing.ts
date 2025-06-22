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
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"div",
			"span",
			"section",
			"article",
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
		ALLOWED_ATTR: [
			"style",
			"href",
			"src",
			"alt",
			"width",
			"height",
			"colspan",
			"rowspan",
			"scope", // for tables
			"type",
			"start",
			"reversed", // for lists
		],
	});
}

/**
 * parser contient les fonctions de parse.
 */
export const parsing = {
	readableUrl,
	sanitizeHTML,
};
