"use client";

import { useDraggable } from "@dnd-kit/react";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { TbPlugConnectedX, TbRss } from "react-icons/tb";
import {
	FeedStatusType,
	type FeedWithContentsCount,
} from "@/app/[locale]/lib/constants";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import {
	SidebarFeedsMenuButton,
	SidebarMenuBadge,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/lib/hooks/use-mobile";

type Props = {
	feed: FeedWithContentsCount;
};

export function FeedsSidebarItem({ feed }: Props) {
	const [isHovered, setIsHovered] = useState(false);
	const [{ selectedFeed }, setSearchParamsState] = useQueryStates(
		searchParamsState.searchParams,
		{
			urlKeys: searchParamsState.urlKeys,
		},
	);
	const { ref, handleRef, isDragging } = useDraggable({
		id: feed.id,
	});

	return (
		<SidebarMenuItem
			ref={ref}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<SidebarFeedsMenuButton
				isActive={selectedFeed === feed.id.toString()}
				data-isdragging={isDragging}
				className="data-[isdragging=true]:border"
				asChild
				onClick={(): void => {
					setSearchParamsState({ selectedFeed: feed.id.toString() });
				}}
			>
				<button
					type="button"
					className="grid grid-cols-[min-content_auto_auto] gap-4 hover:cursor-pointer"
				>
					<ItemIcon
						aria-grabbed={isDragging}
						feed={feed}
						handleRef={handleRef}
						isHovered={isHovered}
						isDragging={isDragging}
					/>
					<span className="truncate min-w-0">{feed.title}</span>
					<SidebarMenuBadge>{feed.contentsCount}</SidebarMenuBadge>
				</button>
			</SidebarFeedsMenuButton>
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
				<RxDragHandleDots2 aria-describedby="drag-handle" />
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
