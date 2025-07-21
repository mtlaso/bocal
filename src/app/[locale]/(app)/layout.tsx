import { cookies } from "next/headers";
import { APP_ROUTES } from "@/app/[locale]/lib/app-routes";
import { COOKIE_NAMES } from "@/app/[locale]/lib/constants";
import { FeedsSidebar } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar";
import { SidebarFeedsProvider } from "@/components/ui/sidebar";
import { AppNavigationMenu } from "../ui/app-navigation-menu";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}): Promise<React.JSX.Element> {
	const cookieStore = await cookies();
	const pathname = cookieStore.get(COOKIE_NAMES.currentPathname)?.value;
	if (pathname && pathname === APP_ROUTES.feeds) {
		return (
			<SidebarFeedsProvider>
				<FeedsSidebar />
				<div className="min-h-screen max-w-6xl mx-auto px-4 mb-12">
					<AppNavigationMenu />
					<main>{children}</main>
				</div>
			</SidebarFeedsProvider>
		);
	}

	return (
		<div className="min-h-screen max-w-6xl mx-auto px-4 mb-12">
			<AppNavigationMenu />
			<main>{children}</main>
		</div>
	);
}
