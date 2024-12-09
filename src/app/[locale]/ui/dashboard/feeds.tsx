import { removeWWW } from "@/app/[locale]/lib/remove-www";
import type { FlattenedFeedsContent } from "@/app/[locale]/lib/schema";
import type { Feed } from "@/db/schema";

type Props = {
	feeds: Feed[];
	flattenedContent: FlattenedFeedsContent[];
};

export async function Feeds({
	feeds,
	flattenedContent,
}: Props): Promise<React.JSX.Element> {
	return (
		<section>
			{/* {feeds.map((feed) => (
				<div key={feed.id}>
					<h1 className="tracking-tight text-xl">{feed.title}</h1>
					<p className="text-muted-foreground">
						{removeWWW(new URL(feed.url).host)}
					</p>
				</div>
			))} */}
			<div>{flattenedContent.length}</div>
			<div className="space-y-6">
				{flattenedContent.map((item) => (
					<article className="" key={`${item.id}-${item.feedId}`}>
						<h1 className="tracking-tight text-xl font-bold">{item.title}</h1>
						<p className="text-primary text-lg font-medium">
							{removeWWW(new URL(item.url).host)}
						</p>
						<p className="text-muted-foreground">
							{new Date(item.date).toLocaleDateString()}
						</p>
					</article>
				))}
			</div>
		</section>
	);
}
