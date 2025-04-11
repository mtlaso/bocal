import { dal } from "@/app/[locale]/lib/dal";
import { AddFeedForm } from "@/app/[locale]/ui/feed/add-feed-form";
import { FeedInfoMenu } from "@/app/[locale]/ui/feed/feed-info-menu";
import { Feeds } from "@/app/[locale]/ui/feed/feeds";
import { FeedInfoSkeleton, FeedsSkeleton } from "@/app/[locale]/ui/skeletons";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
export const experimental_ppr = true;

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

export default function Page(): React.JSX.Element {
	const t = useTranslations("rssFeed");

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

			<Suspense fallback={<FeedsSkeleton />}>
				<FeedsWrapper />
			</Suspense>
		</>
	);
}

async function FeedsInfosWrapper(): Promise<React.JSX.Element> {
	const feeds = await dal.getUserFeeds();
	return <FeedInfoMenu feeds={feeds} />;
}

async function FeedsWrapper(): Promise<React.JSX.Element> {
	const feeds = await dal.getUserFeeds();
	return <Feeds feeds={feeds} />;
}
