import { unfollowFeed } from "@/app/[locale]/lib/actions";
import { useSelectedFeedStore } from "@/app/[locale]/lib/stores/selected-feed-store";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Feed } from "@/db/schema";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { TbSettings } from "react-icons/tb";
import { toast } from "sonner";
export function FeedInfoContextMenu({
	feeds,
}: {
	feeds: Feed[];
}): React.JSX.Element {
	const { selectedFeed } = useSelectedFeedStore();
	const t = useTranslations("rssFeed.info");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-1 text-muted-foreground underline"
					disabled={selectedFeed === "all"}
				>
					<TbSettings />
					{selectedFeed === "all" && t("allFeeds")}
					{selectedFeed !== "all" &&
						feeds.find((feed) => feed.id.toString() === selectedFeed)?.title}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem disabled={selectedFeed === "all"}>
						<UnfollowFeed />
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function UnfollowFeed(): React.JSX.Element {
	const t = useTranslations("rssFeed");
	const { selectedFeed, setSelectedFeed } = useSelectedFeedStore();
	const [pending, startTransition] = useTransition();

	const handleUnfollow = (e: React.MouseEvent): void => {
		startTransition(async () => {
			try {
				e.preventDefault();
				if (selectedFeed === "all") return;

				const res = await unfollowFeed(selectedFeed);
				if (res.message) {
					toast.error(res.message);
					return;
				}

				setSelectedFeed("all");
				toast.success(t(res.successMessage));
			} catch (_err) {
				toast.error(t("errors.unexpected"));
			}
		});
	};

	return (
		<>
			<Button
				className="text-destructive"
				onClick={handleUnfollow}
				variant={"ghost"}
				size={"sm"}
				disabled={pending}
			>
				<Trash />
				{t("unfollow")}
			</Button>
		</>
	);
}
