import { AppNavigationMenu } from "@/app/[locale]/ui/app-navigation-menu";
import { FeedsSidebar } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar";
import { SidebarFeedsProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<SidebarFeedsProvider>
			<FeedsSidebar />
			<div className="min-h-screen w-full max-w-6xl mx-auto px-4 mb-12">
				<AppNavigationMenu />
				<main>{children}</main>
			</div>
		</SidebarFeedsProvider>
	);
}
