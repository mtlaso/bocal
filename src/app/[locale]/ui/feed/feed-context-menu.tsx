import { archiveFeedContent } from "@/app/[locale]/lib/actions";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { BsThreeDots } from "react-icons/bs";
import { TbArchive } from "react-icons/tb";
import { toast } from "sonner";

type Props = {
	url: string;
};

export function FeedContextMenu({ url }: Props): React.JSX.Element {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="text-muted-foreground">
					<BsThreeDots />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<ArchiveFeedContent url={url} />
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function ArchiveFeedContent({ url }: Props): React.JSX.Element {
	const t = useTranslations("rssFeed.contextMenu");
	const [isPending, startTransition] = useTransition();

	const handleArchiveFeed = (): void => {
		toast.success(t("success"));
		startTransition(async () => {
			try {
				const res = await archiveFeedContent(url);
				if (res.errMessage) {
					toast.error(t(res.errMessage));
					return;
				}
			} catch (_err) {
				toast.error(t("errors.unexpected"));
			}
		});
	};

	return (
		<button
			className="flex items-center grow text-sm gap-2 p-1 cursor-pointer"
			onClick={handleArchiveFeed}
			disabled={isPending}
			type="submit"
		>
			<TbArchive aria-hidden />
			{t("archive")}
		</button>
	);
}
