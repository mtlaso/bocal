"use client";

import { useMediaQuery } from "@/app/[locale]/lib/hooks/use-media-query";
import { lusitana } from "@/app/[locale]/ui/fonts";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { Feed } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TbPlugConnectedX, TbRadarFilled, TbRss } from "react-icons/tb";

type Props = {
	feeds: Feed[];
};

export function FeedInfoMenu({ feeds }: Props): React.JSX.Element {
	const totalFeeds = feeds.length;
	const unreachableFeeds = feeds.filter((feed) => feed.errorType !== null);
	const totalContent = feeds.reduce(
		(sum, feed) => sum + (feed.content?.length ?? 0),
		0,
	);

	const [_isOpen, _setIsOpen] = useState(false);
	const _isDesktop = useMediaQuery("(min-width: 768px)");

	return (
		<>
			<div className="md:hidden">
				<FeedInfoMenuMobile />
			</div>
			<div className="hidden md:block">
				<FeedInfoMenuDesktop
					totalFeeds={totalFeeds}
					totalUnreachableFeeds={unreachableFeeds.length}
					feeds={feeds}
					totalContent={totalContent}
				/>
			</div>
		</>
	);
}

function FeedInfoMenuDesktop({
	totalFeeds,
	totalUnreachableFeeds,
	feeds,
	totalContent,
}: {
	totalFeeds: number;
	totalUnreachableFeeds: number;
	feeds: Feed[];
	totalContent: number;
}): React.JSX.Element {
	const t = useTranslations("rssFeed.info");
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Sheet open={isOpen} onOpenChange={(status): void => setIsOpen(status)}>
			<SheetTrigger asChild>
				<div>
					<p className={"text-muted-foreground"}>
						<span>{t("textPartOne")}&nbsp;</span>
						<button type="button" className="underline">
							{t("textFeedsCount", { count: totalFeeds })}
						</button>
						<span>&nbsp;{t("textPartTwo")}&nbsp;</span>
						<button type="button" className="underline">
							{t("textUnreachableCount", { count: totalUnreachableFeeds })}
						</button>
					</p>
					<p className="text-muted-foreground">
						TODO! statut du feed selectionee ici!!! (par pour 'tous')
					</p>
				</div>
			</SheetTrigger>
			<SheetContent side={"left"}>
				<SheetHeader>
					<SheetTitle
						className={`${lusitana.className} mb-6 text-left text-4xl leading-tight`}
					>
						{t("title")}
					</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col gap-4">
					<div
						className={cn(
							navigationMenuTriggerStyle(),
							`w-full px-2 cursor-pointer
							 flex justify-between items-center flex-wrap`,
						)}
					>
						<div className="flex gap-2">
							<TbRadarFilled size={20} className="text-primary" />
							<p>{t("allFeeds")}</p>
						</div>
						<p className="text-primary">{totalContent}</p>
					</div>

					<div>
						<p className="text-muted-foreground text-sm font-bold">
							{t("textFeedsCount", { count: totalFeeds })}
						</p>
						<ScrollArea className="max-h-svh overflow-auto">
							{feeds.map((feed) => (
								<div
									key={feed.id}
									className={cn(
										navigationMenuTriggerStyle(),
										`grid grid-cols-[80%_20%] gap-2
									cursor-pointer w-full px-2`,
										{
											"text-muted-foreground": feed.errorType !== null,
										},
									)}
								>
									<div className="flex gap-2 items-center overflow-hidden">
										{feed.errorType !== null ? (
											<TbPlugConnectedX
												size={20}
												className="text-destructive shrink-0"
											/>
										) : (
											<TbRss size={20} className="text-primary shrink-0" />
										)}
										<p className="truncate">{feed.title}</p>
									</div>
									<p className="text-end text-primary">
										{feed.content?.length}
									</p>
								</div>
							))}
						</ScrollArea>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

function FeedInfoMenuMobile(): React.JSX.Element {
	return <p>mobile</p>;
}
