import { archiveFeedContent } from "@/app/[locale]/lib/actions";
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

export function FeedsContextMenu({ url }: Props): React.JSX.Element {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button type="button" className="flex text-muted-foreground">
					<BsThreeDots />
				</button>
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
				if (res.message) {
					toast.error(t(res.message));
					return;
				}
			} catch (_err) {
				toast.error(t("errors.unexpected"));
			}
		});
	};

	return (
		<button
			className="flex justify-start items-center grow text-sm gap-2 p-1 cursor-pointer"
			onClick={handleArchiveFeed}
			disabled={isPending}
			type="submit"
		>
			<TbArchive />
			{t("archive")}
		</button>
	);
}
