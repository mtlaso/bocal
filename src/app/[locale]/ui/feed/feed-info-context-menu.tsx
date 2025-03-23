import { unfollowFeed } from "@/app/[locale]/lib/actions";
import {
	SELECTED_FEED_DEFAULT,
	searchParamsParsers,
} from "@/app/[locale]/lib/stores/search-params";
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
import { TbClipboard, TbSettings } from "react-icons/tb";
import { toast } from "sonner";

export function FeedInfoContextMenu({
	feeds,
}: {
	feeds: Feed[];
}): React.JSX.Element {
	const [{ selectedFeed }] = useQueryStates(searchParamsParsers);
	const t = useTranslations("rssFeed.info");
	const feed = feeds.find((feed) => feed.id.toString() === selectedFeed);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-1 text-muted-foreground underline cursor-pointer"
					disabled={selectedFeed === SELECTED_FEED_DEFAULT}
				>
					<TbSettings />
					{selectedFeed === SELECTED_FEED_DEFAULT && t("allFeeds")}
					{selectedFeed !== SELECTED_FEED_DEFAULT && feed?.title}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem
						variant="destructive"
						disabled={selectedFeed === SELECTED_FEED_DEFAULT}
					>
						<UnfollowFeed />
					</DropdownMenuItem>
					{selectedFeed !== SELECTED_FEED_DEFAULT && feed?.url && (
						<DropdownMenuItem>
							<CopyFeedURL url={feed.url} />
						</DropdownMenuItem>
					)}
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
		<button
			type="button"
			className="flex justify-start items-center grow text-sm gap-2 p-1"
			onClick={handleUnfollow}
			disabled={pending}
		>
			<Trash className="text-destructive" />
			{t("unfollow")}
		</button>
	);
}

function CopyFeedURL({ url }: { url: string }): React.JSX.Element {
	const t = useTranslations("rssFeed");

	const handleCopy = async (): Promise<void> => {
		try {
			await navigator.clipboard.writeText(url);
			toast.success(t("feedURLCopied"), {
				duration: 2000,
			});
		} catch (_err) {
			toast.error(t("errors.cannotCopuFeedURL"));
		}
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="flex justify-start items-center grow text-sm gap-2 p-1"
		>
			<TbClipboard />
			{t("copyFeedURL")}
		</button>
	);
}
