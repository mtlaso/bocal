"use client";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import {
	FeedStatusType,
	type FeedWithContentsCount,
} from "@/app/[locale]/lib/types";
import { FeedsHeaderContextMenu } from "@/app/[locale]/ui/feeds/feeds-header-context-menu";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSidebarFeeds } from "@/components/ui/sidebar";

type Props = {
	userFeedsWithContentsCount: FeedWithContentsCount[];
};

export function FeedsHeader({
	userFeedsWithContentsCount,
}: Props): React.JSX.Element {
	const feeds = userFeedsWithContentsCount;
	const unreachableFeeds = feeds.filter(
		(feed) => feed.status !== FeedStatusType.ACTIVE,
	);

	return (
		<div className={SPACING.XS}>
			<Details
				totalFeeds={feeds.length}
				totalUnreachableFeeds={unreachableFeeds.length}
			/>
			<FeedsHeaderContextMenu feeds={feeds} />
		</div>
	);
}

function Details({
	totalFeeds,
	totalUnreachableFeeds,
}: {
	totalFeeds: number;
	totalUnreachableFeeds: number;
}): React.JSX.Element {
	const t = useTranslations("rssFeed.info");
	const { toggleSidebar, state } = useSidebarFeeds();
	return (
		<div>
			<div className="flex items-center gap-1">
				<Button
					onClick={toggleSidebar}
					variant="ghost"
					size="icon"
					className="mr-1 size-5"
				>
					{state === "collapsed" && <PanelLeftOpen />}
					{state === "expanded" && <PanelRightOpen />}
				</Button>
				<ShortcutKeys />
			</div>

			<p className="text-muted-foreground">
				<span>{t("textPartOne")}&nbsp;</span>
				<button
					onClick={toggleSidebar}
					type="button"
					className="underline cursor-pointer"
				>
					{t("textFeedsCount", { count: totalFeeds })}
				</button>
				<span>&nbsp;{t("textPartTwo")}&nbsp;</span>
				<button
					onClick={toggleSidebar}
					type="button"
					className="underline cursor-pointer"
				>
					{t("textUnreachableCount", { count: totalUnreachableFeeds })}
				</button>
			</p>
		</div>
	);
}

function ShortcutKeys(): React.JSX.Element {
	return (
		<div className="flex gap-1">
			<Badge variant="outline" asChild>
				<kbd>ctrl</kbd>
			</Badge>
			<Badge variant="outline" asChild>
				<kbd>b</kbd>
			</Badge>
		</div>
	);
}
