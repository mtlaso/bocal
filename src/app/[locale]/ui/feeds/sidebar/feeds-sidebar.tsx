import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { TbSettings } from "react-icons/tb";
import { FeedsSidebarContent } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-content";
import { FeedsSidebarSkeleton } from "@/app/[locale]/ui/skeletons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarContent,
	SidebarFeeds,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
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
			<Footer />
		</SidebarFeeds>
	);
}

function Footer() {
	const t = useTranslations("rssFeed");
	return (
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton>
								<TbSettings /> {t("actions")}
								<ChevronUp className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="top">
							<DropdownMenuItem>{t("addFolder.title")}</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	);
}
