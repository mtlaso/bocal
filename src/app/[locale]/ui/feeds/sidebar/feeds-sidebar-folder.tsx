"use client";

import { useQueryStates } from "nuqs";
import { TbPlugConnectedX, TbRss } from "react-icons/tb";
import { type FeedFolder, FeedStatusType } from "@/app/[locale]/lib/constants";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import {
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
} from "@/components/ui/sidebar";

type Props = {
	folder: FeedFolder;
};

export function FeedsSidebarFolder({ folder }: Props) {
	const [{ selectedFeed }, setSearchParamsState] = useQueryStates(
		searchParamsState.searchParams,
		{
			urlKeys: searchParamsState.urlKeys,
		},
	);
	return (
		<SidebarMenuItem>
			<SidebarMenuButton>{folder.name ?? "uncategorized"}</SidebarMenuButton>
			<SidebarMenuSub>
				{folder.feeds.map((feed) => (
					<SidebarMenuItem key={feed.id}>
						<SidebarMenuSubButton
							isActive={selectedFeed === feed.id.toString()}
							onClick={(): void => {
								setSearchParamsState({ selectedFeed: feed.id.toString() });
							}}
							asChild
						>
							<button
								type="button"
								className="grid grid-cols-[min-content_auto_auto] w-full text-left gap-4 hover:cursor-pointer"
							>
								{feed.status !== FeedStatusType.ACTIVE ? (
									<TbPlugConnectedX />
								) : (
									<TbRss />
								)}
								<span className="truncate">{feed.title}</span>
								<SidebarMenuBadge>{feed.contentsCount}</SidebarMenuBadge>
							</button>
						</SidebarMenuSubButton>
					</SidebarMenuItem>
				))}
			</SidebarMenuSub>
		</SidebarMenuItem>
	);
}
