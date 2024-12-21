import { getUserFeeds } from "@/app/[locale]/lib/data";
import { flattenFeedsContent } from "@/app/[locale]/lib/flatten-feeds-content";
import { AddFeedForm } from "@/app/[locale]/ui/feed/add-feed-form";
import { FeedInfoMenu } from "@/app/[locale]/ui/feed/feed-info-menu";
import { Feeds } from "@/app/[locale]/ui/feed/feeds";
import { lusitana } from "@/app/[locale]/ui/fonts";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";

export default async function Page(): Promise<React.JSX.Element> {
	const t = await getTranslations("rssFeed");
	const userFeeds = await getUserFeeds();
	const flattenedFeeds = await flattenFeedsContent(userFeeds);

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
			<ol start={50} className="bg-destructive">
				<li>
					TODO: afficher un checkbox/switch pour afficher les feeds lus ou non
					et pouvoir les marquer manuellement comme lus
				</li>
				<li>
					Quand un utilisateur ne suit plus un feed, enlever les references dans{" "}
					<code>users_feeds_read_content</code>
				</li>
			</ol>
			<Feeds flattenedContent={flattenedFeeds} />
		</>
	);
}
