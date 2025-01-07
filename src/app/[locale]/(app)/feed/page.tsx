import { getUserFeeds } from "@/app/[locale]/lib/data";
import { flattenFeedsContent } from "@/app/[locale]/lib/flatten-feeds-content";
import { AddFeedForm } from "@/app/[locale]/ui/feed/add-feed-form";
import { FeedInfoMenu } from "@/app/[locale]/ui/feed/feed-info-menu";
import { Feeds } from "@/app/[locale]/ui/feed/feeds";
import { FeedInfoSkeleton, LinksSkeleton } from "@/app/[locale]/ui/skeletons";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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

export default async function Page(): Promise<React.JSX.Element> {
	const t = await getTranslations("rssFeed");

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
				<Suspense fallback={<FeedInfoSkeleton />}>
					<FeedInfoContainer />
				</Suspense>
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<LinksSkeleton />}>
				<FeedsContainer />
			</Suspense>
		</>
	);
}

async function FeedInfoContainer(): Promise<React.JSX.Element> {
	const { feeds } = await getUserFeeds(); // Dedup
	return <FeedInfoMenu feeds={feeds} />;
}

async function FeedsContainer(): Promise<React.JSX.Element> {
	const { feeds, limit } = await getUserFeeds(); // Dedup
	const flattenedFeeds = await flattenFeedsContent(feeds);
	return <Feeds flattenedContent={flattenedFeeds} limit={limit} />;
}
