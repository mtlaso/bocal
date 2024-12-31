import { getUserFeeds } from "@/app/[locale]/lib/data";
import { flattenFeedsContent } from "@/app/[locale]/lib/flatten-feeds-content";
import { searchParamsCache } from "@/app/[locale]/lib/stores/search-params";
import { AddFeedForm } from "@/app/[locale]/ui/feed/add-feed-form";
import { FeedInfoMenu } from "@/app/[locale]/ui/feed/feed-info-menu";
import { Feeds } from "@/app/[locale]/ui/feed/feeds";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata.rssFeed" });

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
	const t = await getTranslations("rssFeed");
	await searchParamsCache.parse(searchParams);
	const userFeeds = await getUserFeeds();
	const flattenedFeeds = await flattenFeedsContent(userFeeds);

	return (
		<>
			<section className={SPACING.SM}>
				<div className="flex justify-between">
					<div className="flex gap-2">
						<h1 className="font-semibold tracking-tight text-3xl">
							{t("rssFeed")}
						</h1>
						<AddFeedForm />
					</div>
				</div>
				<Suspense fallback={<>...</>}>
					<FeedInfoMenu feeds={userFeeds} />
				</Suspense>
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<>...</>}>
				<Feeds flattenedContent={flattenedFeeds} />
			</Suspense>
		</>
	);
}
