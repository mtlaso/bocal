import { getTranslations } from "next-intl/server";
import { UNCATEGORIZED_FEEDS_FOLDER_ID } from "@/app/[locale]/lib/constants";
import { dal } from "@/app/[locale]/lib/dal";
import { FeedsSidebarFolder } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-folder";
import { FeedsSidebarItem } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-item";
import { FeedsSidebarItemAll } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-item-all";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export async function FeedsSidebarContent(): Promise<React.JSX.Element> {
	const [t, userFeedsGroupedByFolder] = await Promise.all([
		getTranslations("rssFeed.info"),
		dal.getUserFeedsGroupedByFolder(),
	]);

	const totalFeeds = userFeedsGroupedByFolder
		.entries()
		.reduce((acc, folder) => {
			return acc + folder[1].feeds.length;
		}, 0);

	const totalFeedsContents = userFeedsGroupedByFolder
		.values()
		.reduce(
			(acc, folder) =>
				acc + folder.feeds.reduce((s, f) => s + f.contentsCount, 0),
			0,
		);

	return (
		<SidebarMenu>
			<FeedsSidebarItemAll totalFeedsContents={totalFeedsContents} />

			<SidebarMenuItem className="px-2">
				<span className="text-xs">
					{t("textFeedsCount", { count: totalFeeds })}
				</span>
			</SidebarMenuItem>

			{[...userFeedsGroupedByFolder.entries()].map(([key, val]) => {
				// -1 = Uncategorized folder.
				if (key === UNCATEGORIZED_FEEDS_FOLDER_ID) {
					return val.feeds.map((feed) => {
						return <FeedsSidebarItem key={feed.id} feed={feed} />;
					});
				}

				return <FeedsSidebarFolder key={key} folder={val} />;
			})}
		</SidebarMenu>
	);
}
