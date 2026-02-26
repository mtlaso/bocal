"use client";

import { useDraggable, useDroppable } from "@dnd-kit/react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useState, useTransition } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import {
	TbFolder,
	TbFolderOpen,
	TbPlugConnectedX,
	TbRss,
} from "react-icons/tb";
import { toast } from "sonner";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { deleteFeedFolder } from "@/lib/actions";
import {
	type FeedFolder,
	FeedStatusType,
	type FeedWithContentsCount,
} from "@/lib/constants";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { searchParamsState } from "@/lib/stores/search-params-states";

type Props = {
	folder: FeedFolder;
	onRemove: (id: number) => void;
	onRemoveFailed: (id: number) => void;
};

export function FeedsSidebarFolder({
	folder,
	onRemove,
	onRemoveFailed,
}: Props) {
	const { ref, isDropTarget } = useDroppable({
		id: folder.folderId,
	});
	const isMobile = useIsMobile();
	const t = useTranslations("rssFeed");

	return (
		<Collapsible
			defaultOpen={folder.feeds.length > 0}
			ref={ref}
			className={`group/collapsible ${isDropTarget ? "bg-accent border" : ""}`}
		>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton asChild>
						<a href="##">
							<TbFolder className="group-data-[state=open]/collapsible:hidden" />
							<TbFolderOpen className="group-data-[state=closed]/collapsible:hidden" />
							<span className="truncate">{folder.folderName}</span>
						</a>
					</SidebarMenuButton>
				</CollapsibleTrigger>

				{/* Context menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuAction showOnHover>
							{/* Afficher sur hover sur les grands écrans (élément visuel, peut être enlevé en cas de problèmes d'accésibilités. */}
							<MoreHorizontal />
							<span className="sr-only">{t("more")}</span>
						</SidebarMenuAction>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-48 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align={isMobile ? "end" : "start"}
					>
						<DropdownMenuItem variant="destructive">
							<DeleteFolder
								onDelete={(id) => onRemove(id)}
								onDeleteFailed={(id) => onRemoveFailed(id)}
								id={folder.folderId}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

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

function DeleteFolder({
	id,
	onDelete,
	onDeleteFailed,
}: {
	id: number;
	onDelete: (id: number) => void;
	onDeleteFailed: (id: number) => void;
}): React.JSX.Element {
	const t = useTranslations("rssFeed");
	const [isPending, startTransition] = useTransition();

	const handleDeleteFeedFolder = (e: React.MouseEvent): void => {
		onDelete(id);
		startTransition(async () => {
			try {
				e.preventDefault();
				const res = await deleteFeedFolder(id);

				if (res.errors) {
					onDeleteFailed(id);
					toast.error(res.errors.id?.join(", "));
					return;
				}

				if (res.errI18Key) {
					onDeleteFailed(id);
					// biome-ignore lint/suspicious/noExplicitAny: valid type.
					toast.error(t(res.errI18Key as any));
					return;
				}
			} catch (err) {
				onDeleteFailed(id);
				if (err instanceof Error) {
					toast.error(err.message);
				} else {
					toast.error(t("errors.unexpected"));
				}
			}
		});
	};

	return (
		<button
			className="flex justify-start items-center grow text-sm gap-2 p-1 cursor-pointer"
			type="button"
			onClick={(e): void => handleDeleteFeedFolder(e)}
			disabled={isPending}
		>
			<Trash2 className="text-destructive" />
			{t("folderContextMenu.deleteFolder")}
		</button>
	);
}
