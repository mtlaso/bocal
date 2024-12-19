"use client";
import { removeWWW } from "@/app/[locale]/lib/remove-www";
import type { FlattenedFeedsContent } from "@/app/[locale]/lib/schema";
import { useSelectedFeedStore } from "@/app/[locale]/lib/stores/selected-feed-store";
import { LinksSkeleton } from "@/app/[locale]/ui/skeletons";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";
import type { Feed } from "@/db/schema";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

type Props = {
	feeds: Feed[];
	flattenedContent: FlattenedFeedsContent[];
};

export function Feeds({ flattenedContent }: Props): React.JSX.Element {
	const [isHydrated, setIsHydrated] = useState(false);
	const locale = useLocale();
	const { selectedFeed } = useSelectedFeedStore();

	const items = flattenedContent.filter((feed) => {
		if (selectedFeed === "all") return true;
		return feed.feedId.toString() === selectedFeed;
	});

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) {
		return <LinksSkeleton />;
	}

	return (
		<section className="grid gap-4">
			{items.map((item, index, arr) => (
				<div key={`${item.id}-${item.feedId}`}>
					<Link className={SPACING.SM} href={item.url} target="_blank">
						<h1 className="tracking-tight text-xl font-semibold">
							{item.title}
						</h1>
						<div>
							<p className="text-primary font-medium">
								{removeWWW(new URL(item.url).host)}
							</p>
							<p className="text-muted-foreground">
								{new Date(item.date).toLocaleDateString(locale)}
							</p>
						</div>
					</Link>
					{index !== arr.length - 1 && (
						<Separator className="my-4 opacity-100" />
					)}
				</div>
			))}
		</section>
	);
}
