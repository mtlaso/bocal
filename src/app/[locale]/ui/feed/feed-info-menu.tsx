"use client";

import { useMediaQuery } from "@/app/[locale]/lib/hooks/use-media-query";
import { lusitana } from "@/app/[locale]/ui/fonts";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { Feed } from "@/db/schema";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TbCircle, TbRadarFilled, TbRss } from "react-icons/tb";

type Props = {
	feeds: Feed[];
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
};

export function FeedInfoMenu({ feeds, className }: Props): React.JSX.Element {
	const _t = useTranslations("rssFeed.info");
	const totalFeeds = feeds.length;
	const unreachableFeeds = feeds.filter((feed) => feed.errorType !== null);
	const totalContent = feeds.reduce(
		(sum, feed) => sum + (feed.content?.length ?? 0),
		0,
	);

	// return (
	// 	<p className={className}>
	// 		<span>{t("textPartOne")}&nbsp;</span>
	// 		<Link className="underline" href="#">
	// 			{t("textFeedsCount", { count: totalFeeds })}
	// 		</Link>
	// 		<span>&nbsp;{t("textPartTwo")}&nbsp;</span>
	// 		<Link className="underline" href="#">
	// 			{t("textUnreachableCount", { count: unreachableFeeds.length })}
	// 		</Link>
	// 	</p>
	// );

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
				<p>
					<span>{t("textPartOne")}&nbsp;</span>
					<button type="button" className="underline">
						{t("textFeedsCount", { count: totalFeeds })}
					</button>
					<span>&nbsp;{t("textPartTwo")}&nbsp;</span>
					<button type="button" className="underline">
						{t("textUnreachableCount", { count: totalUnreachableFeeds })}
					</button>
				</p>
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
						className="flex justify-between items-center flex-wrap
					hover:bg-gray-100 p-2 rounded-lg
					transition-all duration-200 cursor-pointer"
					>
						<div className="flex gap-2">
							<TbRadarFilled size={20} className="text-primary font-bold" />
							<p>{t("allFeeds")}</p>
						</div>
						<p className="text-primary">{totalFeeds}</p>
					</div>

					<div>
						{/* default feed unread  */}
						{feeds.map((feed) => (
							<div
								key={feed.id}
								className="flex justify-between items-center flex-wrap
							hover:bg-gray-100 p-2 rounded-lg
							transition-all duration-200 cursor-pointer"
							>
								<div className="flex gap-2">
									<TbRss size={20} className="text-primary font-bold" />
									<p>{feed.title}</p>
								</div>
								<p className="text-primary">{feed.content?.length}</p>
							</div>
						))}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

function FeedInfoMenuMobile(): React.JSX.Element {
	return <p>mobile</p>;
}
