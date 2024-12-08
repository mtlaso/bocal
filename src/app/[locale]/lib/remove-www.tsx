export const removeWWW = (url: string): string => {
	if (url.startsWith("www.")) {
		return url.slice(4);
	}

	return url;
};
