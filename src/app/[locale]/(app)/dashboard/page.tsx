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
import { AddLinkForm } from "../../ui/dashboard/add-link-form";
import { Links } from "../../ui/links";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata.dashboard" });

	return {
		title: t("title"),
		description: t("description"),
	} satisfies Metadata;
}

/**
 * Renders the dashboard page with link management features.
 *
 * Retrieves translations for the "dashboard" namespace to display a localized title,
 * and presents UI components for adding, searching, and sorting links across desktop
 * and mobile views. A suspense fallback handles the asynchronous loading of the links list.
 *
 * @returns A promise that resolves to a React JSX element representing the dashboard.
 */
export default async function Page(): Promise<React.JSX.Element> {
	const t = await getTranslations("dashboard");

	return (
		<>
			<section className={SPACING.SM}>
				<div className="flex justify-between">
					<div className="flex gap-2 w-full">
						<h1 className="font-semibold tracking-tight text-3xl">
							{t("links")}
						</h1>
						<AddLinkForm />
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
	const links = await getLinks({});

	return <Links links={links} />;
}
