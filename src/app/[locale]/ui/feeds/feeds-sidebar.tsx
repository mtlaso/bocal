import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import { SidebarFeeds } from "@/components/ui/sidebar";

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
			<p>dsadsa</p>
		</SidebarFeeds>
		// <SidebarFeeds>
		//   <SidebarContent>
		//     <SidebarGroup>
		//       <SidebarGroupLabel>Application</SidebarGroupLabel>
		//       <SidebarGroupContent>
		//         <SidebarMenu>
		//           {items.map((item) => (
		//             <SidebarMenuItem key={item.title}>
		//               <SidebarMenuButton asChild>
		//                 <a href={item.url}>
		//                   <item.icon />
		//                   <span>{item.title}</span>
		//                 </a>
		//               </SidebarMenuButton>
		//             </SidebarMenuItem>
		//           ))}
		//         </SidebarMenu>
		//       </SidebarGroupContent>
		//     </SidebarGroup>
		//   </SidebarContent>
		// </SidebarFeeds>
	);
}
