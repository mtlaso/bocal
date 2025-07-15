import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { Suspense } from "react";
import { dal } from "@/app/[locale]/lib/dal";
import {
	SidebarContent,
	SidebarFeeds,
	SidebarFeedsMenuButton,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const _items = [
	{
		title: "Home",
		url: "#",
		icon: Home,
	},
	{
		title: "Inbox",
		url: "#",
		icon: Inbox,
	},
	{
		title: "Calendar",
		url: "#",
		icon: Calendar,
	},
	{
		title: "Search",
		url: "#",
		icon: Search,
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings,
	},
];

export function FeedsSidebar() {
	return (
		<SidebarFeeds>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Feeds (traduire)</SidebarGroupLabel>
					<SidebarGroupContent>
						<Suspense fallback={<p>loading...</p>}>
							<FeedInfoWrapper />
						</Suspense>
						{/* {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarFeedsMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarFeedsMenuButton>
                </SidebarMenuItem>
              ))} */}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</SidebarFeeds>
	);
}

async function FeedInfoWrapper(): Promise<React.JSX.Element> {
	const [_timeline, userFeedsWithContentsCount] = await Promise.all([
		dal.getUserFeedsTimeline(),
		dal.getUserFeedsWithContentsCount(),
	]);

	console.log("feeds", userFeedsWithContentsCount);

	return (
		<SidebarMenu>
			{userFeedsWithContentsCount.map((feed) => (
				<SidebarMenuItem key={feed.id}>
					<SidebarFeedsMenuButton>{feed.title}</SidebarFeedsMenuButton>
					<SidebarMenuBadge>{feed.contentsCount}</SidebarMenuBadge>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}
