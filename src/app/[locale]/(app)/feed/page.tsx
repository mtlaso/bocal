import { getUserFeeds } from "@/app/[locale]/lib/data";
import { Feeds } from "@/app/[locale]/ui/dashboard/feeds";
import { AddFeedForm } from "@/app/[locale]/ui/feed/add-feed-form";
import { FeedInfo } from "@/app/[locale]/ui/feed/feed-info";
import { lusitana } from "@/app/[locale]/ui/fonts";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function Page(): Promise<React.JSX.Element> {
	const t = await getTranslations("rssFeed");
	const userFeeds = await getUserFeeds();

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
				<FeedInfo className="text-muted-foreground" feeds={userFeeds} />
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<p>TODO: change this loading visual...</p>}>
				<Feeds feeds={userFeeds} />
			</Suspense>
		</>
	);
}
