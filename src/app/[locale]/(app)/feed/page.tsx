import { getUserFeeds } from "@/app/[locale]/lib/data";
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

/**
 * Renders the RSS feeds page.
 *
 * This asynchronous component retrieves the translations for the "rssFeed" namespace and builds the page layout. It displays a header with the page title and an add feed form, as well as sections that asynchronously load and display feed information and feed content, each with an appropriate loading skeleton.
 *
 * @returns A promise that resolves to a React JSX element representing the rendered RSS feeds page.
 */
export default async function Page(): Promise<React.JSX.Element> {
	const t = await getTranslations("rssFeed");

	return (
		<>
			<section className={SPACING.SM}>
				<div className="flex gap-2">
					<h1 className="font-semibold tracking-tight text-3xl">
						{t("rssFeed")}
					</h1>
					<AddFeedForm />
				</div>

				<Suspense fallback={<FeedInfoSkeleton />}>
					<FeedsInfosWrapper />
				</Suspense>
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<LinksSkeleton />}>
				<FeedsWrapper />
			</Suspense>
		</>
	);
}

/**
 * Asynchronously retrieves the user's feeds and renders a feed information menu.
 *
 * This function fetches the user's feeds and returns a React component that displays the feeds
 * using the FeedInfoMenu component.
 *
 * @returns A JSX element representing the feed information menu populated with user feeds.
 */
async function FeedsInfosWrapper(): Promise<React.JSX.Element> {
	const feeds = await getUserFeeds(); // Dedup
	return <FeedInfoMenu feeds={feeds} />;
}

/**
 * Fetches user feeds and renders them within a Feeds component.
 *
 * This asynchronous function retrieves the user feeds via getUserFeeds and passes
 * the fetched data as props to the Feeds component.
 *
 * @returns A JSX element containing the displayed user feeds.
 */
async function FeedsWrapper(): Promise<React.JSX.Element> {
	const feeds = await getUserFeeds(); // Dedup
	return <Feeds feeds={feeds} />;
}
