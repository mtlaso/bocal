import ogs from "open-graph-scraper";
import type { OpenGraphScraperOptions } from "open-graph-scraper/types";

type ScrapeDataRespnse = {
	ogTitle: string | null;
	ogImageURL: string | null;
};

export const ogScrape = async (url: string): Promise<ScrapeDataRespnse> => {
	const ogOpts = {
		url: url,
	} satisfies OpenGraphScraperOptions;

	const data: ScrapeDataRespnse = {
		ogTitle: null,
		ogImageURL: null,
	};

	try {
		const ogReq = await ogs(ogOpts);

		const { result, error } = ogReq;
		const ogTitle = !error ? result.ogTitle : null;
		const ogImageURL = !error ? result.ogImage?.at(0)?.url : null;

		data.ogTitle = ogTitle ?? null;
		data.ogImageURL = ogImageURL ?? null;
	} catch (_err) {}

	return data;
};
