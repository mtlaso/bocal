"use client";
import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { DragDropProvider, PointerSensor, useDroppable } from "@dnd-kit/react";
import { useTranslations } from "next-intl";
import { startTransition, use, useOptimistic } from "react";
import { toast } from "sonner";
import { moveFeedIntoFolder } from "@/app/[locale]/lib/actions";
import {
	type FeedFolder,
	type FeedWithContentsCount,
	UNCATEGORIZED_FEEDS_FOLDER_ID,
} from "@/app/[locale]/lib/constants";
import { FeedsSidebarFolder } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-folder";
import { FeedsSidebarItem } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-item";
import { FeedsSidebarItemAll } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-item-all";
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

type Props = {
	userFeedsGroupedByFolderPromise: Promise<FeedFolder[]>;
};

export function FeedsSidebarContent({
	userFeedsGroupedByFolderPromise,
}: Props) {
	const _userFeedsGroupedByFolder = use(userFeedsGroupedByFolderPromise);
	const [userFeedsGroupedByFolder, setUserFeedsGroupedByFolder] = useOptimistic<
		FeedFolder[]
	>(_userFeedsGroupedByFolder);
	const t = useTranslations("rssFeed");

	const handleOnMove = (
		srcFeed: FeedWithContentsCount,
		targetFolderId: number,
	) => {
		// 2. Add feed to target folder.
		setUserFeedsGroupedByFolder((prev) => {
			// Create a deep copy.
			const newFeedsGrouped: FeedFolder[] = structuredClone(prev);

			// 2.1 Remove feed from source folder.
			const srcFolder = newFeedsGrouped.find(
				(folder) => folder.folderId === srcFeed.folderId,
			);
			if (!srcFolder) return prev;
			srcFolder.feeds = srcFolder.feeds.filter(
				(feed) => feed.id !== srcFeed.id,
			);

			// 2.2 Add feed to new folder.
			const targetFolder = newFeedsGrouped.find(
				(folder) => folder.folderId === targetFolderId,
			);
			if (!targetFolder) return prev;
			targetFolder.feeds.push({
				...srcFeed,
				// 2.3 Change srcFeed folderId.
				folderId: targetFolder.folderId,
			});

			// 2.3 Sort feeds in the new target folder to prevent layout shift.
			// Feeds are also fetched from the db in descending order.
			targetFolder.feeds.sort((a, b) => a.title.localeCompare(b.title));

			return newFeedsGrouped;
		});
	};

	return (
		<DragDropProvider
			// @ts-ignore
			modifiers={[RestrictToVerticalAxis]}
			sensors={[
				PointerSensor.configure({
					activatorElements(source) {
						// Move element with the handle and by moving the element itself.
						// https://experimental--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/docs/react-draggable-sensors--docs
						// https://github.com/clauderic/dnd-kit/blob/experimental/apps/stories/stories/react/Draggable/DragHandles/DragHandles.stories.tsx
						return [source.handle, source.element];
					},
				}),
			]}
			onDragEnd={(e) => {
				if (e.canceled) return;
				const targetFolderId = e.operation.target?.id;
				if (targetFolderId === undefined) return;

				// To move feed into new folder (or uncategoriezed):
				// 1. Find source feed.
				const srcFeed = e.operation.source?.data as FeedWithContentsCount;
				if (!srcFeed) return;

				if (targetFolderId === srcFeed.folderId) return;

				startTransition(async () => {
					handleOnMove(srcFeed, targetFolderId as number);
					try {
						const res = await moveFeedIntoFolder(
							srcFeed.id,
							targetFolderId as number,
						);
						if (res.errors) {
							toast.error([res.errors.feedId, res.errors.folderId].join(", "));
							return;
						}

						if (res.errI18Key) {
							// biome-ignore lint/suspicious/noExplicitAny: valid type.
							toast.error(t(res.errI18Key as any));
							return;
						}
					} catch (err) {
						if (err instanceof Error) {
							toast.error(err.message);
						} else {
							toast.error(t("errors.unexpected"));
						}
					}
				});
			}}
		>
			<Content userFeedsGroupedByFolder={userFeedsGroupedByFolder} />
		</DragDropProvider>
	);
}

// This needs to be it's own component so it can be a droppable zone.
// The drop mechanism wouldn't work if it's a direct descendant of the parent component.
function Content({
	userFeedsGroupedByFolder,
}: {
	userFeedsGroupedByFolder: FeedFolder[];
}) {
	const t = useTranslations("rssFeed");

	const totalFeeds = userFeedsGroupedByFolder.values().reduce((acc, folder) => {
		return acc + folder.feeds.length;
	}, 0);
	const totalFeedsContents = userFeedsGroupedByFolder
		.values()
		.reduce(
			(acc, folder) =>
				acc + folder.feeds.reduce((s, f) => s + f.contentsCount, 0),
			0,
		);
	const { ref, isDropTarget } = useDroppable({
		id: UNCATEGORIZED_FEEDS_FOLDER_ID,
	});

	return (
		<SidebarContent ref={ref} className={`${isDropTarget ? "bg-accent" : ""}`}>
			<SidebarGroup>
				<SidebarGroupLabel>{t("rssFeed")}</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<FeedsSidebarItemAll totalFeedsContents={totalFeedsContents} />

						<SidebarMenuItem className="px-2">
							<span className="text-xs">
								{t("info.textFeedsCount", { count: totalFeeds })}
							</span>
						</SidebarMenuItem>

						{userFeedsGroupedByFolder.map((folder) => {
							// -1 = Uncategorized folder.
							if (folder.folderId === UNCATEGORIZED_FEEDS_FOLDER_ID) {
								return folder.feeds.map((feed) => {
									return <FeedsSidebarItem key={feed.id} feed={feed} />;
								});
							}

							return (
								<FeedsSidebarFolder key={folder.folderId} folder={folder} />
							);
						})}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	);
}
