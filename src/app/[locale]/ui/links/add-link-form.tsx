"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { TbLinkPlus } from "react-icons/tb";
import { useMediaQuery } from "@/app/[locale]/lib/hooks/use-media-query";
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
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type AddLinkState, addLink } from "../../lib/actions";
import { SPACING } from "../spacing";

export function AddLinkForm(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return isDesktop ? (
		<AddLinkFormDesktop
			isOpen={isOpen}
			onOpen={(status: boolean): void => setIsOpen(status)}
		/>
	) : (
		<AddLinkFormMobile
			isOpen={isOpen}
			onOpen={(status: boolean): void => setIsOpen(status)}
		/>
	);
}

function AddLinkFormDesktop({
	isOpen,
	onOpen,
}: {
	isOpen: boolean;
	onOpen: (status: boolean) => void;
}): React.JSX.Element {
	const t = useTranslations("dashboard");

	return (
		<Dialog open={isOpen} onOpenChange={(status): void => onOpen(status)}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<TbLinkPlus />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t("addLinkForm.title")}</DialogTitle>
				</DialogHeader>
				<LinkForm />
			</DialogContent>
		</Dialog>
	);
}

function AddLinkFormMobile({
	isOpen,
	onOpen,
}: {
	isOpen: boolean;
	onOpen: (status: boolean) => void;
}): React.JSX.Element {
	const t = useTranslations("dashboard");
	return (
		<Drawer open={isOpen} onOpenChange={onOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" size="icon">
					<TbLinkPlus />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{t("addLinkForm.title")}</DrawerTitle>
				</DrawerHeader>
				<LinkForm className="px-4" />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">{t("addLinkForm.cancel")}</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

function LinkForm({
	className,
}: React.ComponentProps<"form">): React.JSX.Element {
	const initialState: AddLinkState = {
		errors: undefined,
		defaultErrorMessage: undefined,
		payload: undefined,
	};
	const t = useTranslations("dashboard");
	const [state, formAction, pending] = useActionState(addLink, initialState);

	return (
		<form className={cn(SPACING.MD, className)} action={formAction} id="form">
			<div className={`${SPACING.XS}`}>
				<Label htmlFor="url" className="block text-sm font-medium">
					{t("addLinkForm.link")}
				</Label>

				<div className="relative">
					<Input
						className="block w-full cursor-pointer rounded-md py-2 pl-10 outline-2 placeholder:text-gray-500"
						name="url"
						autoFocus
						id="url"
						placeholder="https://..."
						defaultValue={state.payload?.url}
					/>

					<TbLinkPlus className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
				</div>

				{state.errors?.url?.map((err) => (
					<p className="mt-2 text-sm text-destructive" key={err}>
						{err}
					</p>
				))}
				{state?.defaultErrorMessage && (
					<p className="mt-2 text-sm text-destructive">
						{state.defaultErrorMessage}
					</p>
				)}
			</div>

			<Button disabled={pending} type="submit" form="form" className="w-full">
				{t("add")}
			</Button>
		</form>
	);
}
