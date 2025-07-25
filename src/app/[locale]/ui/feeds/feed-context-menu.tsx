"use client";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { BsThreeDots } from "react-icons/bs";
import { TbArchive } from "react-icons/tb";
import { toast } from "sonner";
import { archiveFeedContent } from "@/app/[locale]/lib/actions";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
				if (res.errors) {
					toast.error(res.errors.url?.join());
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
