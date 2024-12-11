import DOMPurify from "isomorphic-dompurify";

export function sanitizeHTML(html: string): string {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: ["p", "a", "b", "i", "em", "strong", "br"],
		ALLOWED_ATTR: ["href"],
	});
}
