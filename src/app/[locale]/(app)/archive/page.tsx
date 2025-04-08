import {
	SearchLinksDesktop,
	SearchLinksMobile,
} from "@/app/[locale]/ui/search-links";
import { LinksSkeleton } from "@/app/[locale]/ui/skeletons";
import { SortLinks } from "@/app/[locale]/ui/sort-links";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { getLinks } from "../../lib/data";
import { Links } from "../../ui/links";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata.archive" });

	return {
		title: t("title"),
		description: t("description"),
	} satisfies Metadata;
}

/**
 * Renders the Archive page.
 *
 * This asynchronous component fetches translations for the "archive" namespace and uses them to display the localized title.
 * It includes desktop and mobile search components, a sorting control, a separator, and a Suspense wrapper that renders a skeleton loader
 * while the archived links are being fetched.
 *
 * @returns A React element representing the rendered Archive page.
 */
export default async function Page(): Promise<React.JSX.Element> {
	const t = await getTranslations("archive");

	return (
		<>
			<section className={SPACING.SM}>
				<div className="flex justify-between">
					<div className="flex gap-2 w-full">
						<h1 className="font-semibold tracking-tight text-3xl">
							{t("archive")}
						</h1>
						<SearchLinksDesktop />
					</div>

					<SortLinks />
				</div>

				<SearchLinksMobile />
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<LinksSkeleton />}>
				<LinksWrapper />
			</Suspense>
		</>
	);
}

async function LinksWrapper(): Promise<React.JSX.Element> {
	const links = await getLinks({ archivedLinksOnly: true });

	return <Links links={links} />;
}
