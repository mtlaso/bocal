import { getTranslations } from "next-intl/server";
import { dal } from "@/app/[locale]/lib/dal";
import { FeedsSidebarMenuItem } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-menu-item";
import { SidebarMenu } from "@/components/ui/sidebar";

export async function FeedsSidebarContent(): Promise<React.JSX.Element> {
	const _t = await getTranslations("rssFeed.info");
	const [_timeline, userFeedsWithContentsCount] = await Promise.all([
		dal.getUserFeedsTimeline(),
		dal.getUserFeedsWithContentsCount(),
	]);

	return (
		<SidebarMenu>
			{/* <SidebarMenuItem
        <SidebarFeedsMenuButton asChild>
          <a href="#">
            <TbRadarFilled />
            <span className="truncate">{t("allFeeds")}</span>
            <SidebarMenuBadge>{timeline[0].length}</SidebarMenuBadge>
          </a>
        </SidebarFeedsMenuButton>
      </SidebarMenuItem> */}

			{userFeedsWithContentsCount.map((feed) => (
				<FeedsSidebarMenuItem key={feed.id} feed={feed} />
			))}
		</SidebarMenu>
	);
}
