"use client";

import { useDraggable, useDroppable } from "@dnd-kit/react";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import {
	TbFolder,
	TbFolderOpen,
	TbPlugConnectedX,
	TbRss,
} from "react-icons/tb";
import {
	type FeedFolder,
	FeedStatusType,
	type FeedWithContentsCount,
} from "@/app/[locale]/lib/constants";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/lib/hooks/use-mobile";

type Props = {
	folder: FeedFolder;
};

export function FeedsSidebarFolder({ folder }: Props) {
	const { ref, isDropTarget } = useDroppable({
		id: folder.folderId,
	});

	return (
		<Collapsible
			defaultOpen={folder.feeds.length > 0}
			ref={ref}
			className={`group/collapsible ${isDropTarget ? "bg-accent border" : ""}`}
		>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						<TbFolder className="group-data-[state=open]/collapsible:hidden" />
						<TbFolderOpen className="group-data-[state=closed]/collapsible:hidden" />
						{folder.folderName}
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{folder.feeds.map((feed) => (
							<Draggable key={feed.id} feed={feed} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
}

function Draggable({ feed }: { feed: FeedWithContentsCount }) {
	const [isHovered, setIsHovered] = useState(false);
	const { ref, handleRef, isDragging } = useDraggable({
		id: feed.id,
		data: feed,
	});
	const [{ selectedFeed }, setSearchParamsState] = useQueryStates(
		searchParamsState.searchParams,
		{
			urlKeys: searchParamsState.urlKeys,
		},
	);

	return (
		<SidebarMenuItem
			ref={ref}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<SidebarMenuSubButton
				isActive={selectedFeed === feed.id.toString()}
				onClick={(): void => {
					setSearchParamsState({ selectedFeed: feed.id.toString() });
				}}
				data-isdragging={isDragging}
				className="data-[isdragging=true]:border"
				asChild
			>
				<button
					type="button"
					className="grid grid-cols-[min-content_auto_auto] w-full text-left gap-4 hover:cursor-pointer"
				>
					<ItemIcon
						feed={feed}
						handleRef={handleRef}
						isHovered={isHovered}
						isDragging={isDragging}
					/>
					<span className="truncate">{feed.title}</span>
					<SidebarMenuBadge>{feed.contentsCount}</SidebarMenuBadge>
				</button>
			</SidebarMenuSubButton>
		</SidebarMenuItem>
	);
}

function ItemIcon({
	feed,
	handleRef,
	isHovered,
	isDragging,
}: {
	feed: FeedWithContentsCount;
	handleRef: (element: Element | null) => void;
	isHovered: boolean;
	isDragging: boolean;
}) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<div ref={handleRef} className="ml-auto">
				<RxDragHandleDots2 />
			</div>
		);
	}

	return (
		<div className="group/itemicon" data-showicon={isHovered || isDragging}>
			<div className="group-data-[showicon=true]/itemicon:hidden">
				{feed.status !== FeedStatusType.ACTIVE ? (
					<TbPlugConnectedX />
				) : (
					<TbRss />
				)}
			</div>
			<div
				ref={handleRef}
				className="hidden group-data-[showicon=true]/itemicon:block"
			>
				<RxDragHandleDots2 />
			</div>
		</div>
	);
}
