import { removeWWW } from "@/app/[locale]/lib/remove-www";
import type { FlattenedFeedsContent } from "@/app/[locale]/lib/schema";
import { Separator } from "@/components/ui/separator";
import type { Feed } from "@/db/schema";
import { Link } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

type Props = {
	feeds: Feed[];
	flattenedContent: FlattenedFeedsContent[];
};

export async function Feeds({
	feeds,
	flattenedContent,
}: Props): Promise<React.JSX.Element> {
	const locale = await getLocale();
	return (
		<section className="grid gap-4">
			{flattenedContent.map((item) => (
				<div key={`${item.id}-${item.feedId}`}>
					<Link href={item.url} target="_blank">
						<h1 className="tracking-tight text-xl font-semibold">
							{item.title}
						</h1>
						<p className="text-primary text-lg font-medium">
							{removeWWW(new URL(item.url).host)}
						</p>
						<p className="text-muted-foreground">
							{new Date(item.date).toLocaleDateString(locale)}
						</p>
					</Link>

					<Separator className="my-4" />
				</div>
			))}
		</section>
	);
}
