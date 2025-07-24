import ogs from "open-graph-scraper"
import type { OpenGraphScraperOptions } from "open-graph-scraper/types"
import "server-only"

type ScrapeDataResponse = {
	ogTitle: string | null
	ogImageURL: string | null
}

/**
 * scrape récupère les données Open Graph d'une URL.
 */
const scrape = async (url: string): Promise<ScrapeDataResponse> => {
	const ogOpts = {
		url: url,
	} satisfies OpenGraphScraperOptions

	const data: ScrapeDataResponse = {
		ogTitle: null,
		ogImageURL: null,
	}

	try {
		const ogReq = await ogs(ogOpts)

		const { result, error } = ogReq
		const ogTitle = !error ? result.ogTitle : null
		const ogImageURL = !error ? result.ogImage?.at(0)?.url : null

		data.ogTitle = ogTitle ?? null
		data.ogImageURL = ogImageURL ?? null
	} catch (_err) {}

	return data
}

/**
 * og contient les fonctionnalités Open Graph.
 */
export const og = {
	scrape,
}
