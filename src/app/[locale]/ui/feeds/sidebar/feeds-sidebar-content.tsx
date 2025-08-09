import { getTranslations } from "next-intl/server";
import { dal } from "@/app/[locale]/lib/dal";
import { FeedsSidebarFolder } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-folder";
import { FeedsSidebarItem } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-item";
import { FeedsSidebarItemAll } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-item-all";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export async function FeedsSidebarContent(): Promise<React.JSX.Element> {
	const [timeline, t, userFeedsGroupedByFolder] = await Promise.all([
		dal.getUserFeedsTimeline(),
		getTranslations("rssFeed.info"),
		dal.getUserFeedsGroupedByFolder(),
	]);

	const totalfeeds = userFeedsGroupedByFolder
		.entries()
		.reduce((acc, [_, val]) => {
			return acc + val.feeds.length;
		}, 0);

	return (
		<SidebarMenu>
			<FeedsSidebarItemAll totalFeedsContents={timeline.length} />

			<SidebarMenuItem className="px-2">
				<span className="text-xs font-md">
					{t("textFeedsCount", { count: totalfeeds })}
				</span>
			</SidebarMenuItem>

			{[...userFeedsGroupedByFolder.entries()].map(([key, val]) => {
				if (key) {
					return <FeedsSidebarFolder key={key} folder={val} />;
				}

				return val.feeds.map((feed) => {
					return <FeedsSidebarItem key={feed.id} feed={feed} />;
				});
			})}
		</SidebarMenu>
	);
}
