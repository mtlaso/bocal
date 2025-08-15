import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { dal } from "@/app/[locale]/lib/dal";
import { FeedsSidebarContent } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-content";
import { FeedsSidebarFooter } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-footer";
import { FeedsSidebarSkeleton } from "@/app/[locale]/ui/skeletons";
import {
	SidebarContent,
	SidebarFeeds,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function FeedsSidebar() {
	const t = useTranslations("rssFeed");
	const userFeedsGroupedByFolder = dal.getUserFeedsGroupedByFolder();

	return (
		<SidebarFeeds>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{t("rssFeed")}</SidebarGroupLabel>
					<SidebarGroupContent>
						<Suspense fallback={<FeedsSidebarSkeleton />}>
							<FeedsSidebarContent
								userFeedsGroupedByFolderPromise={userFeedsGroupedByFolder}
							/>
						</Suspense>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<FeedsSidebarFooter />
		</SidebarFeeds>
	);
}
