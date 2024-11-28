"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { TbLinkPlus } from "react-icons/tb";
import { type AddLinkState, addLink } from "../../lib/actions";

export function AddLinkForm(): React.JSX.Element {
	const initialState: AddLinkState = { errors: undefined, message: null };
	const t = useTranslations("dashboard");
	const [state, formAction, pending] = useActionState(addLink, initialState);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<TbLinkPlus />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{t("addLinkForm.title")}</DialogTitle>
				</DialogHeader>
				<form action={formAction} className="rid ga-2" id="form">
					<div>
						<Label htmlFor="link" className="block text-sm font-medium">
							{t("addLinkForm.link")}
						</Label>

						<div className="relative">
							<Input
								className="block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
								name="link"
								autoFocus
								id="link"
								placeholder="https://..."
								// required
							/>

							<TbLinkPlus className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
						</div>

						{state.errors?.url?.map((err) => (
							<p className="mt-2 text-sm text-red-500" key={err}>
								{t(err)}
							</p>
						))}
						{JSON.stringify(state)}

						<p>pending: {Boolean(pending)}</p>
						{state?.message && (
							<p className="mt-2 text-sm text-red-500">{t(state.message)}</p>
						)}
					</div>
				</form>
				<DialogFooter>
					<Button type="submit" form="form">
						{t("add")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
