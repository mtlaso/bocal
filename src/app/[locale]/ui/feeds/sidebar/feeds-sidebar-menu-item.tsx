"use client";

import { useQueryStates } from "nuqs";
import { TbPlugConnectedX, TbRss } from "react-icons/tb";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import {
	FeedStatusType,
	type FeedWithContentsCount,
} from "@/app/[locale]/lib/types";
import {
	SidebarFeedsMenuButton,
	SidebarMenuBadge,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type Props = {
	feed: FeedWithContentsCount;
};

export function FeedsSidebarMenuItem({ feed }: Props) {
	const [{ selectedFeed }, setSearchParamsState] = useQueryStates(
		searchParamsState.searchParams,
		{
			urlKeys: searchParamsState.urlKeys,
		},
	);
	return (
		<SidebarMenuItem
			key={feed.id}
			className={cn({
				"bg-accent rounded-md text-sm": selectedFeed === feed.id.toString(),
			})}
		>
			<SidebarFeedsMenuButton
				asChild
				onClick={(): void => {
					setSearchParamsState({ selectedFeed: feed.id.toString() });
				}}
			>
				{/* biome-ignore lint/a11y/useValidAnchor: link */}
				<a href="#">
					{feed.status !== FeedStatusType.ACTIVE ? (
						<TbPlugConnectedX />
					) : (
						<TbRss />
					)}
					<span className="truncate">{feed.title}</span>
					<SidebarMenuBadge>{feed.contentsCount}</SidebarMenuBadge>
				</a>
			</SidebarFeedsMenuButton>
		</SidebarMenuItem>
	);
}
