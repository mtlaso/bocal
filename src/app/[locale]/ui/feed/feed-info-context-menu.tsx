import { unfollowFeed } from "@/app/[locale]/lib/actions";
import {
	SELECTED_FEED_DEFAULT,
	searchParamsParsers,
} from "@/app/[locale]/lib/stores/search-params";
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
import { useQueryStates } from "nuqs";
import { useTransition } from "react";
import { TbSettings } from "react-icons/tb";
import { toast } from "sonner";
export function FeedInfoContextMenu({
	feeds,
}: {
	feeds: Feed[];
}): React.JSX.Element {
	const [{ selectedFeed }] = useQueryStates(searchParamsParsers);
	const t = useTranslations("rssFeed.info");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-1 text-muted-foreground underline"
					disabled={selectedFeed === SELECTED_FEED_DEFAULT}
				>
					<TbSettings />
					{selectedFeed === SELECTED_FEED_DEFAULT && t("allFeeds")}
					{selectedFeed !== SELECTED_FEED_DEFAULT &&
						feeds.find((feed) => feed.id.toString() === selectedFeed)?.title}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem disabled={selectedFeed === SELECTED_FEED_DEFAULT}>
						<UnfollowFeed />
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function UnfollowFeed(): React.JSX.Element {
	const t = useTranslations("rssFeed");
	const [{ selectedFeed }, setSelectedFeed] =
		useQueryStates(searchParamsParsers);
	const [pending, startTransition] = useTransition();

	const handleUnfollow = (e: React.MouseEvent): void => {
		startTransition(async () => {
			try {
				e.preventDefault();
				if (selectedFeed === SELECTED_FEED_DEFAULT) return;

				const res = await unfollowFeed(selectedFeed);
				if (res.message) {
					toast.error(t(res.message));
					return;
				}

				setSelectedFeed({ selectedFeed: SELECTED_FEED_DEFAULT });
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
