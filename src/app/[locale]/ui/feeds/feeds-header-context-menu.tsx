import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useTransition } from "react";
import { TbClipboard, TbSettings } from "react-icons/tb";
import { toast } from "sonner";
import { unfollowFeed } from "@/app/[locale]/lib/actions";
import type { FeedWithContentsCount } from "@/app/[locale]/lib/constants";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import { userfeedsfuncs } from "@/app/[locale]/lib/userfeeds-funcs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FeedsHeaderContextMenu({
	feeds,
}: {
	feeds: FeedWithContentsCount[];
}): React.JSX.Element {
	const [{ selectedFeed }] = useQueryStates(searchParamsState.searchParams, {
		urlKeys: searchParamsState.urlKeys,
	});
	const t = useTranslations("rssFeed.info");
	const feed = feeds.find((feed) => feed.id.toString() === selectedFeed);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-1 text-muted-foreground underline cursor-pointer"
					disabled={selectedFeed === searchParamsState.DEFAULT_FEED}
				>
					<TbSettings />
					{selectedFeed === searchParamsState.DEFAULT_FEED && t("allFeeds")}
					{selectedFeed !== searchParamsState.DEFAULT_FEED && feed?.title}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem
						variant="destructive"
						disabled={selectedFeed === searchParamsState.DEFAULT_FEED}
					>
						<UnfollowFeed />
					</DropdownMenuItem>
					{selectedFeed !== searchParamsState.DEFAULT_FEED && feed?.url && (
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
	const [{ selectedFeed }, setSearchParamsState] = useQueryStates(
		searchParamsState.searchParams,
		{ urlKeys: searchParamsState.urlKeys },
	);
	const [pending, startTransition] = useTransition();

	const handleUnfollow = (e: React.MouseEvent): void => {
		startTransition(async () => {
			try {
				e.preventDefault();
				if (selectedFeed === searchParamsState.DEFAULT_FEED) return;

				const res = await unfollowFeed(Number.parseInt(selectedFeed));
				if (res.errors) {
					toast.error(res.errors.feedId?.join("."));
					return;
				}

				if (res.errI18Key) {
					// biome-ignore lint/suspicious/noExplicitAny: valid type.
					toast.error(t(res.errI18Key as any));
					return;
				}

				setSearchParamsState({ selectedFeed: searchParamsState.DEFAULT_FEED });
				toast.success(t("successUnfollow"));
			} catch (err) {
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
			type="button"
			className="flex justify-start items-center grow text-sm gap-2 p-1 cursor-pointer"
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
			await navigator.clipboard.writeText(userfeedsfuncs.formatFeedURL(url));
			toast.success(t("feedURLCopied"), {
				duration: 2000,
			});
		} catch (err) {
			if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error(t("errors.cannotCopyFeedURL"));
			}
		}
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="flex justify-start items-center grow text-sm gap-2 p-1 cursor-pointer"
		>
			<TbClipboard />
			{t("copyFeedURL")}
		</button>
	);
}
