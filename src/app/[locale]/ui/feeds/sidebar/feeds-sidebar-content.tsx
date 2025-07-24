import { getTranslations } from "next-intl/server";
import { dal } from "@/app/[locale]/lib/dal";
import { FeedsSidebarMenuItem } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-menu-item";
import { FeedsSidebarMenuItemAll } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-menu-item-all";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export async function FeedsSidebarContent(): Promise<React.JSX.Element> {
	const [timeline, userFeedsWithContentsCount, t] = await Promise.all([
		dal.getUserFeedsTimeline(),
		dal.getUserFeedsWithContentsCount(),
		getTranslations("rssFeed.info"),
	]);

	return (
		<SidebarMenu>
			<FeedsSidebarMenuItemAll totalFeedsContents={timeline.length} />

			<SidebarMenuItem className="mt-4 px-2 text-xs font-md">
				<span>
					{t("textFeedsCount", { count: userFeedsWithContentsCount.length })}
				</span>
			</SidebarMenuItem>

			{userFeedsWithContentsCount.map((feed) => (
				<FeedsSidebarMenuItem key={feed.id} feed={feed} />
			))}
		</SidebarMenu>
	);
}
