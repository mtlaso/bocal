import { connection } from "next/server";
import { Suspense } from "react";
import { dal } from "@/app/[locale]/lib/dal";
import { FeedsSidebarContent } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-content";
import { FeedsSidebarFooter } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-footer";
import { FeedsSidebarSkeleton } from "@/app/[locale]/ui/skeletons";
import { SidebarFeeds } from "@/components/ui/sidebar";

export async function FeedsSidebar() {
	await connection();
	const userFeedsGroupedByFolder = dal.getUserFeedsGroupedByFolder();

	return (
		<SidebarFeeds>
			<Suspense fallback={<FeedsSidebarSkeleton />}>
				<FeedsSidebarContent
					userFeedsGroupedByFolderPromise={userFeedsGroupedByFolder}
				/>
			</Suspense>
			<FeedsSidebarFooter />
		</SidebarFeeds>
	);
}
