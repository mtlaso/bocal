export const parseURL = (url: string): string => {
	const parsedURL = URL.parse(url);
	if (parsedURL) {
		if (parsedURL.hostname.startsWith("www.")) {
			return parsedURL.hostname.slice(4);
		}

		return parsedURL.hostname;
	}

	return url;
};
