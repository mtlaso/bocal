"use client";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TbFolderPlus, TbSettings } from "react-icons/tb";
import { LENGTHS } from "@/app/[locale]/lib/constants";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
} from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function FeedsSidebarFooter() {
	const t = useTranslations("rssFeed");
	const [isOpen, setIsOpen] = useState(false);
	const isMobile = useIsMobile();

	return (
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton>
								<TbSettings /> {t("actions")}
								<ChevronUp className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="top">
							<DropdownMenuItem
								onSelect={() => {
									setIsOpen(true);
								}}
							>
								<TbFolderPlus />
								{t("addFolder.title")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{isMobile && (
						<AddFeedFolderFormMobile isOpen={isOpen} onOpenChange={setIsOpen} />
					)}
					{!isMobile && (
						<AddFeedFolderDesktop isOpen={isOpen} onOpenChange={setIsOpen} />
					)}
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	);
}

function AddFeedFolderDesktop({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (status: boolean) => void;
}) {
	const t = useTranslations("rssFeed");

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="w-11/12 sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t("addFolder.title")}</DialogTitle>
					<DialogDescription>{t("addFolder.description")}</DialogDescription>
				</DialogHeader>
				<FolderForm />
			</DialogContent>
		</Dialog>
	);
}

function AddFeedFolderFormMobile({
	isOpen,
	onOpenChange: onOpen,
}: {
	isOpen: boolean;
	onOpenChange: (status: boolean) => void;
}): React.JSX.Element {
	const t = useTranslations("rssFeed");
	return (
		<Drawer autoFocus={isOpen} open={isOpen} onOpenChange={onOpen}>
			<DrawerContent>
				<DrawerHeader>
					<DialogTitle className="text-left">
						{t("addFolder.title")}
					</DialogTitle>
					<DialogDescription>{t("addFolder.description")}</DialogDescription>
				</DrawerHeader>
				<FolderForm className="px-4" />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">{t("addFolder.cancel")}</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

function FolderForm({ className }: React.ComponentPropsWithRef<"form">) {
	const t = useTranslations("rssFeed");
	return (
		<form className={cn(SPACING.MD, className)} id="form">
			<div className={SPACING.XS}>
				<Label htmlFor="folder-name" className="block text-sm font-medium">
					{t("addFolder.folder-name")}
				</Label>

				<div className="relative">
					<Input
						id="folder-name"
						name="folder-name"
						minLength={LENGTHS.feeds.addFeedFolder.name.min}
						maxLength={LENGTHS.feeds.addFeedFolder.name.max}
						required
						className="block w-full cursor-pointer rounded-md py-2 pl-10 outline-2 placeholder:text-gray-500"
						autoFocus
						placeholder={t("addFolder.folder-name")}
					/>

					<TbFolderPlus className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
				</div>
			</div>

			<Button className="w-full" type="submit" form="form">
				{t("addFolder.add")}
			</Button>
		</form>
	);
}
