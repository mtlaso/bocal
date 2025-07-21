"use client";

import { useQueryStates } from "nuqs";
import { TbPlugConnectedX, TbRss } from "react-icons/tb";
import {
	FeedStatusType,
	type FeedWithContentsCount,
} from "@/app/[locale]/lib/constants";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import {
	SidebarFeedsMenuButton,
	SidebarMenuBadge,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

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
		<SidebarMenuItem>
			<SidebarFeedsMenuButton
				isActive={selectedFeed === feed.id.toString()}
				asChild
				onClick={(): void => {
					setSearchParamsState({ selectedFeed: feed.id.toString() });
				}}
			>
				{/* biome-ignore lint/a11y/useValidAnchor: link */}
				<a href="#" className="grid grid-cols-[min-content_1fr_auto] gap-4">
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
