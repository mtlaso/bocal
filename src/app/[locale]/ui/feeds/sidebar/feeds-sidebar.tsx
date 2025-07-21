import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { FeedsSidebarContent } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-content";
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

	return (
		<SidebarFeeds>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{t("rssFeed")}</SidebarGroupLabel>
					<SidebarGroupContent>
						<Suspense fallback={<FeedsSidebarSkeleton />}>
							<FeedsSidebarContent />
						</Suspense>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</SidebarFeeds>
	);
}
