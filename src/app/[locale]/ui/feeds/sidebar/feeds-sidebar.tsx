"use client";
import { useTranslations } from "next-intl";
import { APP_ROUTES } from "@/app/[locale]/lib/app-routes";
import {
	SidebarContent,
	SidebarFeeds,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/routing";

export function FeedsSidebar({ children }: { children: React.ReactNode }) {
	const t = useTranslations("rssFeed");
	const pathname = usePathname();
	if (pathname !== APP_ROUTES.feeds) return null;

	return (
		<SidebarFeeds>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{t("rssFeed")}</SidebarGroupLabel>
					<SidebarGroupContent>{children}</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</SidebarFeeds>
	);
}
