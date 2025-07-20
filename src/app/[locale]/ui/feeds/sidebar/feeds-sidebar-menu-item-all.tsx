"use client";

import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { TbRadarFilled } from "react-icons/tb";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import {
	SidebarFeedsMenuButton,
	SidebarMenuBadge,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

type Props = {
	totalFeedsContents: number;
};

export function FeedsSidebarMenuItemAll({ totalFeedsContents }: Props) {
	const t = useTranslations("rssFeed.info");
	const [{ selectedFeed }, setSearchParamsState] = useQueryStates(
		searchParamsState.searchParams,
		{
			urlKeys: searchParamsState.urlKeys,
		},
	);
	return (
		<SidebarMenuItem>
			<SidebarFeedsMenuButton
				isActive={selectedFeed === searchParamsState.DEFAULT_FEED}
				asChild
				onClick={(): void => {
					setSearchParamsState({
						selectedFeed: searchParamsState.DEFAULT_FEED,
					});
				}}
			>
				{/* biome-ignore lint/a11y/useValidAnchor: link */}
				<a href="#">
					<TbRadarFilled />
					<span className="truncate">{t("allFeeds")}</span>
					<SidebarMenuBadge>{totalFeedsContents}</SidebarMenuBadge>
				</a>
			</SidebarFeedsMenuButton>
		</SidebarMenuItem>
	);
}
