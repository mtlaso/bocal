"use client";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { TbLinkPlus } from "react-icons/tb";
import { addFeed } from "@/app/[locale]/lib/actions";
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

export function AddFeedForm(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return isDesktop ? (
		<AddFeedFormDesktop
			isOpen={isOpen}
			onOpen={(status: boolean): void => setIsOpen(status)}
		/>
	) : (
		<AddFeedFormMobile
			isOpen={isOpen}
			onOpen={(status: boolean): void => setIsOpen(status)}
		/>
	);
}

function AddFeedFormDesktop({
	isOpen,
	onOpen,
}: {
	isOpen: boolean;
	onOpen: (status: boolean) => void;
}): React.JSX.Element {
	const t = useTranslations("rssFeed");

	return (
		<Dialog open={isOpen} onOpenChange={(status): void => onOpen(status)}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<TbLinkPlus />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t("addFeedForm.title")}</DialogTitle>
				</DialogHeader>
				<FeedForm />
			</DialogContent>
		</Dialog>
	);
}

function AddFeedFormMobile({
	isOpen,
	onOpen,
}: {
	isOpen: boolean;
	onOpen: (status: boolean) => void;
}): React.JSX.Element {
	const t = useTranslations("rssFeed");
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
						{t("addFeedForm.title")}
					</DialogTitle>
				</DrawerHeader>
				<FeedForm className="px-4" />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">{t("addFeedForm.cancel")}</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

const FeedForm = ({
	className,
}: React.ComponentProps<"form">): React.JSX.Element => {
	const t = useTranslations("rssFeed");
	const [state, formAction, pending] = useActionState(addFeed, {});

	return (
		<form className={cn(SPACING.MD, className)} action={formAction} id="form">
			<div className={SPACING.XS}>
				<Label htmlFor="url" className="block text-sm font-medium">
					{t("addFeedForm.link")}
				</Label>

				<div className="relative">
					<Input
						type="url"
						required
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

				{state?.errI18Key && (
					<p className="mt-2 text-sm text-destructive">
						{/* biome-ignore lint/suspicious/noExplicitAny: correct value */}
						{t(state.errI18Key as any)}
					</p>
				)}

				{state?.isSuccessful && (
					<p className="mt-2 text-sm text-primary">{t("success")}</p>
				)}
			</div>

			<Button className="w-full" disabled={pending} type="submit" form="form">
				{t("add")}
			</Button>
		</form>
	);
};
