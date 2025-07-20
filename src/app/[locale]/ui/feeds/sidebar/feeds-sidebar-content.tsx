import { dal } from "@/app/[locale]/lib/dal";
import { FeedsSidebarMenuItem } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-menu-item";
import { FeedsSidebarMenuItemAll } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-menu-item-all";
import { SidebarMenu } from "@/components/ui/sidebar";

export async function FeedsSidebarContent(): Promise<React.JSX.Element> {
	const [timeline, userFeedsWithContentsCount] = await Promise.all([
		dal.getUserFeedsTimeline(),
		dal.getUserFeedsWithContentsCount(),
	]);

	return (
		<SidebarMenu>
			<FeedsSidebarMenuItemAll totalFeedsContents={timeline[0].length} />

			{userFeedsWithContentsCount.map((feed) => (
				<FeedsSidebarMenuItem key={feed.id} feed={feed} />
			))}
		</SidebarMenu>
	);
}
