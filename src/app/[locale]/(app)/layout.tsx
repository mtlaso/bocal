import { FeedsSidebar } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar";
import { FeedsSidebarContent } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-content";
import { SidebarFeedsProvider } from "@/components/ui/sidebar";
import { AppNavigationMenu } from "../ui/app-navigation-menu";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<SidebarFeedsProvider>
			<FeedsSidebar>
				<FeedsSidebarContent />
			</FeedsSidebar>
			<div className="min-h-screen max-w-6xl mx-auto px-4 mb-12">
				<AppNavigationMenu />
				<main>{children}</main>
			</div>
		</SidebarFeedsProvider>
	);
}
