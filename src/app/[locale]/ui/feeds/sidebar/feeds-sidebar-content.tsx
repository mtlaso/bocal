"use client";
import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { DragDropProvider, PointerSensor } from "@dnd-kit/react";
import { useTranslations } from "next-intl";
import { use, useState } from "react";
import {
	type FeedsFolders,
	UNCATEGORIZED_FEEDS_FOLDER_ID,
} from "@/app/[locale]/lib/constants";
import { logger } from "@/app/[locale]/lib/logging";
import { FeedsSidebarFolder } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-folder";
import { FeedsSidebarItem } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-item";
import { FeedsSidebarItemAll } from "@/app/[locale]/ui/feeds/sidebar/feeds-sidebar-item-all";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

type Props = {
	userFeedsGroupedByFolderPromise: Promise<FeedsFolders>;
};

export function FeedsSidebarContent({
	userFeedsGroupedByFolderPromise,
}: Props) {
	const _userFeedsGroupedByFolder = use(userFeedsGroupedByFolderPromise);
	const [userFeedsGroupedByFolder, _setUserFeedsGroupedByFolder] =
		useState<FeedsFolders>(_userFeedsGroupedByFolder);
	const t = useTranslations("rssFeed.info");

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
				logger.info("source", e.operation.source?.id);
				logger.info("target", e.operation.target?.id);
			}}
		>
			<SidebarMenu>
				<FeedsSidebarItemAll totalFeedsContents={totalFeedsContents} />

				<SidebarMenuItem className="px-2">
					<span className="text-xs">
						{t("textFeedsCount", { count: totalFeeds })}
					</span>
				</SidebarMenuItem>

				{[...userFeedsGroupedByFolder.entries()].map(([key, val]) => {
					// -1 = Uncategorized folder.
					if (key === UNCATEGORIZED_FEEDS_FOLDER_ID) {
						return val.feeds.map((feed) => {
							return <FeedsSidebarItem key={feed.id} feed={feed} />;
						});
					}

					return <FeedsSidebarFolder key={key} folder={val} />;
				})}
			</SidebarMenu>
		</DragDropProvider>
	);
}
