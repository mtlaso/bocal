import { MoreHorizontal, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { BsArchive } from "react-icons/bs";
import { TbLinkPlus } from "react-icons/tb";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "@/i18n/routing";
import { archiveLink, deleteLink, unarchiveLink } from "@/lib/actions";
import { APP_ROUTES } from "@/lib/constants";

export function LinksContextMenu({
	id,
	onRemove,
}: {
	id: number;
	onRemove: (id: number) => void;
}): React.JSX.Element {
	const pathname = usePathname();

	const isDashboardPage = pathname === APP_ROUTES.links;
	const isArchivePage = pathname === APP_ROUTES.archive;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="link"
					size="icon"
					className="max-w-min text-foreground"
				>
					<MoreHorizontal />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					{isDashboardPage && (
						<DropdownMenuItem>
							<ArchiveLink id={id} onArchive={(id) => onRemove(id)} />
						</DropdownMenuItem>
					)}

					{isArchivePage && (
						<DropdownMenuItem>
							<UnArchiveLink id={id} onUnarchive={(id) => onRemove(id)} />
						</DropdownMenuItem>
					)}

					<DropdownMenuItem variant="destructive">
						<DeleteLink id={id} onDelete={(id) => onRemove(id)} />
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function UnArchiveLink({
	id,
	onUnarchive,
}: {
	id: number;
	onUnarchive: (id: number) => void;
}): React.JSX.Element {
	const t = useTranslations("dashboard");
	const [isPending, startTransition] = useTransition();

	const handleUnArchiveLink = (e: React.MouseEvent): void => {
		e.preventDefault();
		onUnarchive(id);
		startTransition(async () => {
			try {
				const res = await unarchiveLink(id);

				if (res.errors) {
					toast.error(res.errors.id?.join(", "));
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
			type="button"
			onClick={(e): void => handleUnArchiveLink(e)}
			className="flex justify-start items-center grow text-sm gap-2 p-1 cursor-pointer"
			disabled={isPending}
		>
			<TbLinkPlus />
			{t("unarchive")}
		</button>
	);
}

function ArchiveLink({
	id,
	onArchive,
}: {
	id: number;
	onArchive: (id: number) => void;
}): React.JSX.Element {
	const t = useTranslations("dashboard");
	const [isPending, startTransition] = useTransition();

	const handleArchiveLink = (e: React.MouseEvent): void => {
		e.preventDefault();
		onArchive(id);
		startTransition(async () => {
			try {
				const res = await archiveLink(id);

				if (res.errors) {
					toast.error(res.errors.id?.join(", "));
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
			onClick={(e): void => handleArchiveLink(e)}
			type="button"
			disabled={isPending}
			className="flex justify-start items-center grow text-sm gap-2 p-1 cursor-pointer"
		>
			<BsArchive />
			{t("archive")}
		</button>
	);
}

function DeleteLink({
	id,
	onDelete,
}: {
	id: number;
	onDelete: (id: number) => void;
}): React.JSX.Element {
	const t = useTranslations("dashboard");
	const [isPending, startTransition] = useTransition();

	const handleDeleteLink = (e: React.MouseEvent): void => {
		e.preventDefault();
		onDelete(id);
		startTransition(async () => {
			try {
				const res = await deleteLink(id);

				if (res.errors) {
					toast.error(res.errors.id?.join(", "));
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
			className="flex justify-start items-center grow text-sm gap-2 p-1 cursor-pointer"
			type="button"
			onClick={(e): void => handleDeleteLink(e)}
			disabled={isPending}
		>
			<Trash className="text-destructive" />
			{t("delete")}
		</button>
	);
}
