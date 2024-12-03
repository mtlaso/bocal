"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "sonner";
import { deleteLink } from "../../lib/actions";

export function LinksContextMenu({ id }: { id: string }): React.JSX.Element {
	const _t = useTranslations("dashboard");
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
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<DeleteLink id={id} />
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function DeleteLink({ id }: { id: string }): React.JSX.Element {
	const t = useTranslations("dashboard");
	const [isPending, startTransition] = useTransition();

	const handleDeleteInvoice = (e: React.MouseEvent): void => {
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
			<Button
				onClick={(e): void => handleDeleteInvoice(e)}
				variant={"ghost"}
				size={"sm"}
				disabled={isPending}
			>
				<Trash />
				{t("delete")}
			</Button>
		</>
	);
}
