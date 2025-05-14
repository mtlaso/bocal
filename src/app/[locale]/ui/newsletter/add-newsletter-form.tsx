"use client";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { TbLinkPlus, TbMail } from "react-icons/tb";

import {
	type AddNewsletterState,
	addNewsletter,
} from "@/app/[locale]/lib/actions";
import { useMediaQuery } from "@/app/[locale]/lib/hooks/use-media-query";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";

export function AddNewsletterForm(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return isDesktop ? (
		// <AddFeedFormDesktop
		//   isOpen={isOpen}
		//   onOpen={(status: boolean): void => setIsOpen(status)}
		// />
		<p>en cours...</p>
	) : (
		<AddNewsletterFormMobile
			isOpen={isOpen}
			onOpen={(status: boolean): void => setIsOpen(status)}
		/>
	);
}

function AddNewsletterFormMobile({
	isOpen,
	onOpen,
}: {
	isOpen: boolean;
	onOpen: (status: boolean) => void;
}): React.JSX.Element {
	const t = useTranslations("newsletter");
	return (
		<Drawer open={isOpen} onOpenChange={onOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" size="icon">
					<TbLinkPlus />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DialogTitle className="text-left">
						{t("addNewsletterForm.title")}
					</DialogTitle>
				</DrawerHeader>
				<NewsletterForm className="px-4" />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">{t("addNewsletterForm.cancel")}</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

function NewsletterForm({
	className,
}: {
	className?: string;
}): React.JSX.Element {
	const t = useTranslations("newsletter");
	const initialState: AddNewsletterState = {
		errors: undefined,
		message: undefined,
		data: undefined,
	};
	const [_state, _formAction, pending] = useActionState(
		addNewsletter,
		initialState,
	);

	return (
		<form className={cn(SPACING.LG, "grid", className)} id="form">
			<div className={SPACING.SM}>
				<Label htmlFor="title" className="block text-sm font-medium">
					{t("addNewsletterForm.feedTitle")}
				</Label>

				<div className="relative">
					<Input
						className="block w-full cursor-pointer rounded-md py-2 pl-10 outline-2 placeholder:text-gray-500"
						name="title"
						autoFocus
						id="title"
						placeholder={t("addNewsletterForm.feedTitle")}
					/>

					<TbMail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
				</div>
			</div>

			<Button disabled={pending} type="submit" form="form">
				{t("add")}
			</Button>
		</form>
	);
}
