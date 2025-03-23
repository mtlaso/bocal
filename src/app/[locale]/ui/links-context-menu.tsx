"use client";
import {
	archiveLink,
	deleteLink,
	unarchiveLink,
} from "@/app/[locale]/lib/actions";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "@/i18n/routing";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { BsArchive, BsThreeDots } from "react-icons/bs";
import { TbLinkPlus } from "react-icons/tb";
import { toast } from "sonner";

export function LinksContextMenu({ id }: { id: string }): React.JSX.Element {
	const pathname = usePathname();

	const isDashboardPage = pathname === "/dashboard";
	const isArchivePage = pathname === "/archive";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="link"
					size="icon"
					className="max-w-min text-foreground"
				>
					<BsThreeDots />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					{isDashboardPage && (
						<DropdownMenuItem>
							<ArchiveLink id={id} />
						</DropdownMenuItem>
					)}

					{isArchivePage && (
						<DropdownMenuItem>
							<UnArchiveLink id={id} />
						</DropdownMenuItem>
					)}

					<DropdownMenuItem variant="destructive">
						<DeleteLink id={id} />
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function UnArchiveLink({ id }: { id: string }): React.JSX.Element {
	const t = useTranslations("dashboard");
	const [isPending, startTransition] = useTransition();

	const handleUnArchiveLink = (e: React.MouseEvent): void => {
		startTransition(async () => {
			try {
				e.preventDefault();
				const res = await unarchiveLink(id);

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
		<>
			<button
				type="button"
				onClick={(e): void => handleUnArchiveLink(e)}
				className="flex justify-start items-center grow text-sm gap-2 p-1 cursor-pointer"
				disabled={isPending}
			>
				<TbLinkPlus />
				{t("unarchive")}
			</button>
		</>
	);
}

function ArchiveLink({ id }: { id: string }): React.JSX.Element {
	const t = useTranslations("dashboard");
	const [isPending, startTransition] = useTransition();

	const handleArchiveLink = (e: React.MouseEvent): void => {
		startTransition(async () => {
			try {
				e.preventDefault();
				const res = await archiveLink(id);

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
		<>
			<button
				onClick={(e): void => handleArchiveLink(e)}
				type="button"
				disabled={isPending}
				className="flex justify-start items-center grow text-sm gap-2 p-1 cursor-pointer"
			>
				<BsArchive />
				{t("archive")}
			</button>
		</>
	);
}

function DeleteLink({ id }: { id: string }): React.JSX.Element {
	const t = useTranslations("dashboard");
	const [isPending, startTransition] = useTransition();

	const handleDeleteLink = (e: React.MouseEvent): void => {
		startTransition(async () => {
			try {
				e.preventDefault();
				const res = await deleteLink(id);

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
		<>
			<button
				className="flex justify-start items-center grow text-sm gap-2 p-1 cursor-pointer"
				type="button"
				onClick={(e): void => handleDeleteLink(e)}
				disabled={isPending}
			>
				<Trash className="text-destructive" />
				{t("delete")}
			</button>
		</>
	);
}
