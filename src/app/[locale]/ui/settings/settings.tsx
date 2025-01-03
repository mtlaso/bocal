"use client";

import { SPACING } from "@/app/[locale]/ui/spacing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { TbMail, TbUserCircle } from "react-icons/tb";

type Props = {
	email: string;
	name: string;
};

export function Settings({ email, name }: Props): React.JSX.Element {
	const t = useTranslations("settings");
	return (
		<section>
			<section className={cn("mb-12", SPACING.MD)}>
				<h1 className="text-xl font-medium">{t("profileSection.title")}</h1>

				<div className={SPACING.SM}>
					<Label htmlFor="email" className="block text-sm font-medium">
						{t("profileSection.email")}
					</Label>

					<div className="relative">
						<Input
							disabled
							className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
							autoFocus
							id="email"
							value={email}
						/>

						<TbMail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
					</div>
				</div>

				<div className={SPACING.SM}>
					<Label htmlFor="name" className="block text-sm font-medium">
						{t("profileSection.name")}
					</Label>

					<div className="relative">
						<Input
							disabled
							className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
							autoFocus
							id="name"
							value={name}
						/>

						<TbUserCircle className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
					</div>
				</div>
			</section>

			<ViewSection />

			{/* export section */}
			<section className={cn("mb-12", SPACING.MD)}>
				<div className={SPACING.SM}>
					<h1 className="text-xl font-medium">
						{t("exportDataSection.title")}
					</h1>
					<p className="text-sm text-muted-foreground">
						{t("exportDataSection.description")}
					</p>
				</div>

				<form className={SPACING.MD}>
					<Button disabled type="submit">
						{t("exportDataSection.export")}
					</Button>
				</form>
			</section>

			{/* delete section */}
			<section className={SPACING.MD}>
				<div className={SPACING.SM}>
					<h1 className="text-xl font-medium text-destructive">
						{t("deleteAccountSection.title")}
					</h1>
					<p className="text-sm text-muted-foreground">
						{t("deleteAccountSection.description")}
					</p>
				</div>

				<form className={SPACING.MD}>
					<Button disabled variant={"destructive"} type="submit">
						{t("deleteAccountSection.delete")}
					</Button>
				</form>
			</section>
		</section>
	);
}

const ViewSection = (): React.JSX.Element => {
	const t = useTranslations("settings.viewSection");

	return (
		<section className={cn("mb-12", SPACING.MD)}>
			<h1 className="text-xl font-medium">{t("title")}</h1>

			<form className={SPACING.SM}>
				{/* section 1 */}
				<div className="flex items-center justify-between gap-4 border rounded-md p-3">
					<div className={SPACING.SM}>
						<Label className="font-bold text-base" htmlFor="hide-images">
							{t("hideImages.title")}
						</Label>
						<p className="text-sm text-muted-foreground">
							{t("hideImages.description")}
						</p>
					</div>

					<Switch id="hide-images" />
				</div>

				{/* section 2 */}
				<div className="flex items-center justify-between gap-4 border rounded-md p-3">
					<div className={SPACING.SM}>
						<Label className="font-bold text-base" htmlFor="grid-view">
							{t("gridView.title")}
						</Label>
						<p className="text-sm text-muted-foreground">
							{t("gridView.description")}
						</p>
					</div>

					<Switch id="grid-view" />
				</div>

				{/* section 3 */}
				<div className="flex items-center justify-between gap-4 border rounded-md p-3">
					<div className={SPACING.SM}>
						<Label className="font-bold text-base" htmlFor="rss-limit">
							{t("feed.title")}
						</Label>
						<p className="text-sm text-muted-foreground">
							{t("feed.description")}
						</p>
					</div>

					<Select name="test">
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t("feed.title")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="15">15</SelectItem>
							<SelectItem value="20">20</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</form>
		</section>
	);
};
