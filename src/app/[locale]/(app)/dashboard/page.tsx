import { searchParamsCache } from "@/app/[locale]/lib/stores/search-params";
import { LinksSkeleton } from "@/app/[locale]/ui/skeletons";
import { SortLinks } from "@/app/[locale]/ui/sort-links";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { SearchParams } from "nuqs/server";
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

type PageProps = {
	searchParams: Promise<SearchParams>;
};

export default async function Page({
	searchParams,
}: PageProps): Promise<React.JSX.Element> {
	const t = await getTranslations("dashboard");
	await searchParamsCache.parse(searchParams);
	const links = await getLinks({});

	return (
		<>
			<section className="flex justify-between">
				<div className="flex gap-2">
					<h1 className="font-semibold tracking-tight text-3xl">
						{t("links")}
					</h1>
					<AddLinkForm />
				</div>
				<Suspense fallback={<>...</>}>
					<SortLinks />
				</Suspense>
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<LinksSkeleton />}>
				<Links links={links} view={"grid"} />
			</Suspense>
		</>
	);
}
