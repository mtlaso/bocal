import { getUserFeeds } from "@/app/[locale]/lib/data";
import { flattenFeedsContent } from "@/app/[locale]/lib/flatten-feeds-content";
import { Feeds } from "@/app/[locale]/ui/feed/feeds";
import { AddFeedForm } from "@/app/[locale]/ui/feed/add-feed-form";
import { FeedInfoMenu } from "@/app/[locale]/ui/feed/feed-info-menu";
import { lusitana } from "@/app/[locale]/ui/fonts";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";

export default async function Page(): Promise<React.JSX.Element> {
	const t = await getTranslations("rssFeed");
	const userFeeds = await getUserFeeds();
	const flattenedFeeds = flattenFeedsContent(userFeeds);

	return (
		<>
			<section className={SPACING.SM}>
				<div className="flex justify-between">
					<div className="flex gap-2">
						<h1
							className={`${lusitana.className} font-semibold tracking-tight text-3xl`}
						>
							{t("rssFeed")}
						</h1>
						<AddFeedForm />
					</div>
				</div>
				<FeedInfoMenu feeds={userFeeds} />
			</section>

			<Separator className="my-4" />

			<Feeds feeds={userFeeds} flattenedContent={flattenedFeeds} />
		</>
	);
}
