import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { dal } from "@/app/[locale]/lib/dal";
import { Links } from "@/app/[locale]/ui/links/links";
import {
	SearchLinksDesktop,
	SearchLinksMobile,
} from "@/app/[locale]/ui/links/search-links";
import { LinksSkeleton } from "@/app/[locale]/ui/skeletons";
import { SortLinks } from "@/app/[locale]/ui/links/sort-links";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
export const experimental_ppr = true;

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

export default function Page(): React.JSX.Element {
	const t = useTranslations("archive");

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
	const links = await dal.getLinks({ archivedLinksOnly: true });

	return <Links links={links} />;
}
