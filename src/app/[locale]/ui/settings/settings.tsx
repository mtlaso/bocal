"use client";
import { FeedContentLimitForm } from "@/app/[locale]/ui/settings/view/feed-content-limit-form";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { TbMail, TbUser } from "react-icons/tb";

type Props = {
	email: string | null;
	name?: string | null;
	feedContentLimit: number;
};

export function Settings({
	email,
	name,
	feedContentLimit,
}: Props): React.JSX.Element {
	const t = useTranslations("settings");
	return (
		<section>
			<section className={cn("mb-12", SPACING.MD)}>
				<h1 className="text-xl font-medium">{t("profileSection.title")}</h1>

				<div className={SPACING.SM}>
					<div>
						<Label htmlFor="email" className="block text-sm font-medium">
							{t("profileSection.email")}
						</Label>

						<div className="relative">
							<Input
								disabled
								className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
								autoFocus
								id="email"
								value={email ?? ""}
							/>

							<TbMail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
						</div>
					</div>

					<div>
						<Label htmlFor="name" className="block text-sm font-medium">
							{t("profileSection.name")}
						</Label>

						<div className="relative">
							<Input
								disabled
								className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
								autoFocus
								id="name"
								value={name ?? ""}
							/>

							<TbUser className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
						</div>
					</div>
				</div>
			</section>

			<ViewSection feedContentLimit={feedContentLimit} />

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

const ViewSection = ({
	feedContentLimit,
}: { feedContentLimit: number }): React.JSX.Element => {
	const t = useTranslations("settings.viewSection");

	return (
		<section className={cn("mb-12", SPACING.MD)}>
			<h1 className="text-xl font-medium">{t("title")}</h1>

			<div className={SPACING.SM}>
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

				<FeedContentLimitForm feedContentLimit={feedContentLimit} />
			</div>
		</section>
	);
};
