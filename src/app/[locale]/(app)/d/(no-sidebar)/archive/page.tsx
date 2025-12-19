import type { Metadata } from "next";
import { type Locale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense, use } from "react";
import { Links } from "@/app/[locale]/ui/links/links";
import {
	SearchLinksDesktop,
	SearchLinksMobile,
} from "@/app/[locale]/ui/links/search-links";
import { SortLinks } from "@/app/[locale]/ui/links/sort-links";
import { LinksSkeleton } from "@/app/[locale]/ui/skeletons";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
import { dal } from "@/lib/dal";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale as Locale,
		namespace: "metadata",
	});

	return {
		title: t("archive.title"),
		description: t("archive.description"),
	} satisfies Metadata;
}

export default function Page({
	params,
}: PageProps<"/[locale]/d/archive">): React.JSX.Element {
	const { locale } = use(params);
	setRequestLocale(locale as Locale);
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
	const links = await dal.getUserLinks({ archivedLinksOnly: true });

	return <Links links={links} />;
}
