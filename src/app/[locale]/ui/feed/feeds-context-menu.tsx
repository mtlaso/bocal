import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { BsThreeDots } from "react-icons/bs";
import { TbArchive } from "react-icons/tb";

export function FeedsContextMenu(): React.JSX.Element {
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
						<ArchiveFeedContent />
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function ArchiveFeedContent(): React.JSX.Element {
	const t = useTranslations("rssFeed");
	return (
		<Button type="button" variant={"ghost"} size={"sm"}>
			<TbArchive />
			<span>{t("contextMenu.archive")}</span>
		</Button>
	);
}
