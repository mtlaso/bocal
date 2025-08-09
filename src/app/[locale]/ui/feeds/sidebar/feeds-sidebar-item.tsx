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

export function FeedsSidebarItem({ feed }: Props) {
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
				<button
					type="button"
					className="grid grid-cols-[min-content_auto_auto] gap-4 hover:cursor-pointer"
				>
					{feed.status !== FeedStatusType.ACTIVE ? (
						<TbPlugConnectedX />
					) : (
						<TbRss />
					)}
					<span className="truncate">{feed.title}</span>
					<SidebarMenuBadge>{feed.contentsCount}</SidebarMenuBadge>
				</button>
			</SidebarFeedsMenuButton>
		</SidebarMenuItem>
	);
}
