"use client";
import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { DragDropProvider, PointerSensor, useDroppable } from "@dnd-kit/react";
import { useTranslations } from "next-intl";
import { use, useState } from "react";
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
	const { ref, isDropTarget } = useDroppable({
		id: UNCATEGORIZED_FEEDS_FOLDER_ID,
	});

	const _userFeedsGroupedByFolder = use(userFeedsGroupedByFolderPromise);
	const [userFeedsGroupedByFolder, _setUserFeedsGroupedByFolder] = useState<
		FeedFolder[]
	>(_userFeedsGroupedByFolder);
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

				// 2. Add feed to target folder.
				// setUserFeedsGroupedByFolder((prev) => {
				// 	// Create copy.
				// 	const newFeedsGrouped = new Map(prev);

				// 	// 2.1 Remove feed from source folder.
				// 	const srcFolder = newFeedsGrouped.get(srcFeed.folderId);
				// 	if (!srcFolder) return prev;
				// 	console.log(`Will remove ${srcFeed.id} from ${srcFolder.folderId}`);
				// 	srcFolder.feeds = srcFolder.feeds.filter(
				// 		(feed) => feed.id !== srcFeed.id,
				// 	);

				// 	// // 3.2 Add feed to new folder.
				// 	const targetFolder = newFeedsGrouped.get(targetFolderId as number);
				// 	if (!targetFolder) return prev;
				// 	targetFolder.feeds.push(srcFeed);

				// 	return newFeedsGrouped;
				// });
			}}
		>
			<SidebarContent
				ref={ref}
				className={`${isDropTarget ? "bg-red-200 border" : ""}`}
			>
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
		</DragDropProvider>
	);
}
