import { removeWWW } from "@/app/[locale]/lib/remove-www";
import type { Feed } from "@/db/schema";

type Props = {
	feeds: Feed[];
};

export async function Feeds({ feeds }: Props): Promise<React.JSX.Element> {
	return (
		<section>
			<h1 className="font-bold tracking-tighter text-2xl">
				Feeds ({feeds.length})
			</h1>
			{feeds.map((feed) => (
				<div key={feed.id}>
					{/* return <p>Following xxx feeds with xxx unreachable</p>; */}
					{/* <p>{JSON.stringify(feed)}</p> */}
					<h1 className="tracking-tight text-xl">{feed.title}</h1>
					<p className="text-muted-foreground">
						{removeWWW(new URL(feed.url).host)}
					</p>
				</div>
			))}
		</section>
	);
}
