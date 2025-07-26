import type { Metadata } from "next";
import { type Locale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { dal } from "@/app/[locale]/lib/dal";
import { AddFeedForm } from "@/app/[locale]/ui/feeds/add-feed-form";
import { FeedsHeader } from "@/app/[locale]/ui/feeds/feeds-header";
import { FeedsTimeline } from "@/app/[locale]/ui/feeds/feeds-timeline";
import { FeedInfoSkeleton, FeedsSkeleton } from "@/app/[locale]/ui/skeletons";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
export const experimental_ppr = true;

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
		title: t("rssFeed.title"),
		description: t("rssFeed.description"),
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
					<FeedsHeaderWrapper />
				</Suspense>
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<FeedsSkeleton />}>
				<FeedsWrapper />
			</Suspense>
		</>
	);
}

async function FeedsHeaderWrapper(): Promise<React.JSX.Element> {
	const userFeedsWithContentsCount = await dal.getUserFeedsWithContentsCount();
	return (
		<FeedsHeader userFeedsWithContentsCount={userFeedsWithContentsCount} />
	);
}

async function FeedsWrapper(): Promise<React.JSX.Element> {
	const [timeline, sess] = await Promise.all([
		dal.getUserFeedsTimeline(),
		dal.verifySession(),
	]);

	return (
		<FeedsTimeline
			timeline={timeline}
			// At this point, we have verified the session and have access to the user's preferences.
			// So we can assert with '!'.
			// biome-ignore lint/style/noNonNullAssertion: it's defined.
			userPreferences={sess!.user.preferences}
		/>
	);
}
