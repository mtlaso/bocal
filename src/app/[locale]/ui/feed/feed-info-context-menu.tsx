import {
	type UnfollowFeedState,
	unfollowFeed,
} from "@/app/[locale]/lib/actions";
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
import { useActionState, useEffect } from "react";
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
				>
					<TbSettings />
					{selectedFeed === "all" && t("allFeeds")}
					{selectedFeed !== "all" &&
						feeds.find((feed) => feed.id.toString() === selectedFeed)?.title}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						{selectedFeed !== "all" && <UnfollowFeed />}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function UnfollowFeed(): React.JSX.Element {
	const t = useTranslations("rssFeed");
	const { selectedFeed } = useSelectedFeedStore();

	const initlialState: UnfollowFeedState = {
		errors: undefined,
		message: undefined,
		data: undefined,
	};
	const [state, formAction, pending] = useActionState(
		unfollowFeed,
		initlialState,
	);

	useEffect((): void => {
		if (state.successMessage) {
			toast.success(t(state.successMessage));
			return;
		}

		if (state.message) {
			toast.error(t(state.message));
			return;
		}
	}, [state.message, state.successMessage, t]);

	if (selectedFeed === "all") return <></>;

	return (
		<form action={formAction}>
			<Button
				className="text-destructive"
				variant={"ghost"}
				size={"sm"}
				disabled={pending}
			>
				<input type="hidden" name="feedId" value={selectedFeed} />
				<Trash />
				{t("unfollow")}
			</Button>
		</form>
	);
}
