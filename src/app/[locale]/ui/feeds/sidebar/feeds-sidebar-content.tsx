import { getTranslations } from "next-intl/server";
import { TbPlugConnectedX, TbRadarFilled, TbRss } from "react-icons/tb";
import { dal } from "@/app/[locale]/lib/dal";
import { FeedStatusType } from "@/app/[locale]/lib/types";
import {
	SidebarFeedsMenuButton,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export async function FeedsSidebarContent(): Promise<React.JSX.Element> {
	const t = await getTranslations("rssFeed.info");
	const [timeline, userFeedsWithContentsCount] = await Promise.all([
		dal.getUserFeedsTimeline(),
		dal.getUserFeedsWithContentsCount(),
	]);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarFeedsMenuButton asChild>
					{/* biome-ignore lint/a11y/useValidAnchor: link */}
					<a href="#">
						<TbRadarFilled />
						<span className="truncate">{t("allFeeds")}</span>
						<SidebarMenuBadge>{timeline[0].length}</SidebarMenuBadge>
					</a>
				</SidebarFeedsMenuButton>
			</SidebarMenuItem>

			{userFeedsWithContentsCount.map((feed) => (
				<SidebarMenuItem key={feed.id}>
					<SidebarFeedsMenuButton asChild>
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
			))}
		</SidebarMenu>
	);
}
