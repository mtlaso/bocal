"use client";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { TbLinkPlus, TbMail } from "react-icons/tb";
import {
	type AddNewsletterState,
	addNewsletter,
} from "@/app/[locale]/lib/actions";
import { LENGTHS } from "@/app/[locale]/lib/constants";
import { useMediaQuery } from "@/app/[locale]/lib/hooks/use-media-query";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function AddNewsletterForm(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return isDesktop ? (
		<AddNewsletterFormDesktop
			isOpen={isOpen}
			onOpen={(status: boolean): void => setIsOpen(status)}
		/>
	) : (
		<AddNewsletterFormMobile
			isOpen={isOpen}
			onOpen={(status: boolean): void => setIsOpen(status)}
		/>
	);
}

function AddNewsletterFormDesktop({
	isOpen,
	onOpen,
}: {
	isOpen: boolean;
	onOpen: (status: boolean) => void;
}): React.JSX.Element {
	const t = useTranslations("newsletter");

	return (
		<Dialog open={isOpen} onOpenChange={(status): void => onOpen(status)}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<TbLinkPlus />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t("addNewsletterForm.title")}</DialogTitle>
				</DialogHeader>
				<NewsletterForm />
			</DialogContent>
		</Dialog>
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
		defaultErrMessage: undefined,
		data: undefined,
	};
	const [state, action, pending] = useActionState(addNewsletter, initialState);

	return (
		<form
			action={action}
			className={cn(SPACING.LG, "grid", className)}
			id="form"
		>
			<div className={SPACING.SM}>
				<Label htmlFor="title" className="block text-sm font-medium">
					{t("addNewsletterForm.feedTitle")}
				</Label>

				<div className="relative">
					<Input
						required
						minLength={LENGTHS.newsletters.title.min}
						maxLength={LENGTHS.newsletters.title.max}
						className="block w-full cursor-pointer rounded-md py-2 pl-10 outline-2 placeholder:text-gray-500"
						name="title"
						autoFocus
						id="title"
						placeholder={t("addNewsletterForm.feedTitle")}
						defaultValue={state.data?.title}
					/>

					<TbMail
						aria-hidden
						className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"
					/>
				</div>

				{state.errors?.title?.map((err) => (
					<p className="mt-2 text-sm text-destructive" key={err}>
						{t(err)}
					</p>
				))}

				{state?.defaultErrMessage && (
					<p className="mt-2 text-sm text-destructive">
						{t(state.defaultErrMessage)}
					</p>
				)}

				{state?.successMessage && (
					<p className="mt-2 text-sm text-green-500">
						{t(state.successMessage)}
					</p>
				)}
			</div>

			<Button disabled={pending} type="submit" form="form">
				{t("add")}
			</Button>
		</form>
	);
}
