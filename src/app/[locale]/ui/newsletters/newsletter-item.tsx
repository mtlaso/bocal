"use client";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { BsThreeDots } from "react-icons/bs";
import { TbAlertCircle, TbCopy, TbNews } from "react-icons/tb";
import { toast } from "sonner";
import { deleteNewsletter } from "@/app/[locale]/lib/actions";
import { userfeedsfuncs } from "@/app/[locale]/lib/userfeeds-funcs";
import { SPACING } from "@/app/[locale]/ui/spacing";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Feed } from "@/db/schema";

export function NewsletterItem({ item }: { item: Feed }): React.JSX.Element {
	const t = useTranslations("newsletter");
	function copyToClipboard(text: string): void {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success(t("copiedToClipboard"));
			})
			.catch(() => {
				toast.error(t("failedToCopyToClipboard"));
			});
	}

	return (
		<div className={SPACING.MD}>
			<div className="flex justify-between">
				<h2
					className="tracking-tight text-xl font-semibold line-clamp-3
        flex items-center gap-2"
				>
					<TbNews />
					{item.title}
				</h2>

				<ContextMenu item={item} />
			</div>

			<div className={SPACING.MD}>
				<div className={SPACING.SM}>
					<Label
						htmlFor={`url-${item.id}`}
						className="block text-sm font-medium"
					>
						{t("descFeedUrl")}
					</Label>

					<div className="flex gap-2">
						<Input
							value={userfeedsfuncs.formatFeedURL(item.url)}
							disabled
							className="block w-full rounded-md py-2"
							id={`url-${item.id}`}
						/>

						<Button
							onClick={(): void =>
								copyToClipboard(userfeedsfuncs.formatFeedURL(item.url))
							}
							variant="outline"
							size="icon"
						>
							<TbCopy />
						</Button>
					</div>
				</div>

				<div className={SPACING.SM}>
					<Label
						htmlFor={`email-${item.id}`}
						className="block text-sm font-medium"
					>
						{t("descUsermail")}
					</Label>

					<div className="flex items-center gap-2">
						<Input
							value={userfeedsfuncs.formatUsermail(item.eid)}
							disabled
							className="block w-full rounded-md py-2"
							id={`email-${item.id}`}
						/>
						<Button
							onClick={(): void =>
								copyToClipboard(userfeedsfuncs.formatUsermail(item.eid))
							}
							variant="outline"
							size="icon"
						>
							<TbCopy />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function ContextMenu({ item }: { item: Feed }): React.JSX.Element {
	const t = useTranslations("newsletter.deleteNewsletterContextMenu");
	const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="text-muted-foreground">
						<BsThreeDots />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuGroup>
						<DropdownMenuItem
							className="text-sm"
							variant="destructive"
							onSelect={(): void => setIsAlertDialogOpen(true)}
						>
							<Trash />
							{t("delete")}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<DeleteNewsletterDialog
				open={isAlertDialogOpen}
				onOpenChange={setIsAlertDialogOpen}
				feedId={item.id}
			/>
		</>
	);
}

function DeleteNewsletterDialog({
	open,
	onOpenChange,
	feedId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	feedId: number;
}): React.JSX.Element {
	const t = useTranslations("newsletter");
	const [isPending, startTransition] = useTransition();

	function handleDeleteNewsletter(): void {
		startTransition(async () => {
			try {
				const res = await deleteNewsletter(feedId);
				if (res.errors) {
					toast.error(res.errors.id?.join());
					return;
				}

				if (res.errI18Key) {
					toast.error(t(res.errI18Key));
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
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<TbAlertCircle className="h-8 w-8 text-destructive" />
					<AlertDialogTitle>
						{t("deleteNewsletterContextMenu.title")}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("deleteNewsletterContextMenu.desc")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						{t("deleteNewsletterContextMenu.cancel")}
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={isPending}
						onClick={handleDeleteNewsletter}
						className={buttonVariants({ variant: "destructive" })}
					>
						{t("deleteNewsletterContextMenu.delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
