"use client";
import { useTranslations } from "next-intl";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import {
	setFeedContentLimit,
	setHideReadFeedContent,
} from "@/app/[locale]/lib/actions";
import type { UserPreferences } from "@/app/[locale]/lib/constants";
import { SPACING } from "@/app/[locale]/ui/spacing";
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

type Props = {
	userPreferences: UserPreferences;
};

export function ViewSection({ userPreferences }: Props): React.JSX.Element {
	const t = useTranslations("settings.viewSection");

	return (
		<section className={cn("mb-12", SPACING.LG)}>
			<h1 className="text-xl font-medium">{t("title")}</h1>

			<Group>
				<FeedContentLimitForm
					feedContentLimit={userPreferences.feedContentLimit}
				/>
				<HideReadFeedContentForm
					hideReadFeedContent={userPreferences.hideReadFeedContent}
				/>
			</Group>
		</section>
	);
}

function Group({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<div className={cn("border rounded-md p-4", SPACING.LG)}>{children}</div>
	);
}

function FeedContentLimitForm({
	feedContentLimit,
}: {
	feedContentLimit: number;
}): React.JSX.Element {
	const [value, setValue] = useOptimistic(feedContentLimit);

	const handleFeedLimit = (e: string): void => {
		startTransition(async () => {
			try {
				setValue(Number.parseInt(e));
				toast.success(t("success"));
				const res = await setFeedContentLimit(Number.parseInt(e));

				if (res.errors) {
					setValue(feedContentLimit);
					toast.error(res.errors.feedContentLimit?.join(", "));
					return;
				}

				if (res.errI18Key) {
					setValue(feedContentLimit);
					// biome-ignore lint/suspicious/noExplicitAny: valid type.
					toast.error(t(res.errI18Key as any));
				}
			} catch (err) {
				setValue(feedContentLimit);
				if (err instanceof Error) {
					toast.error(err.message);
				} else {
					toast.error(t("errors.unexpected"));
				}
			}
		});
	};

	const t = useTranslations("settings.viewSection");

	return (
		<div className="flex justify-between items-center gap-4">
			<div className={SPACING.XS}>
				<Label className="font-bold text-base" htmlFor="feed-limit">
					{t("feed.title")}
				</Label>
				<p className="text-sm text-muted-foreground">{t("feed.description")}</p>
			</div>

			<Select
				onValueChange={(e): void => {
					handleFeedLimit(e);
				}}
				value={value.toString()}
			>
				<SelectTrigger id="feed-limit" className="w-[180px]">
					<SelectValue placeholder={t("feed.title")} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="10">10</SelectItem>
					<SelectItem value="15">15</SelectItem>
					<SelectItem value="20">20</SelectItem>
					<SelectItem value="25">25</SelectItem>
					<SelectItem value="30">30</SelectItem>
					<SelectItem value="35">35</SelectItem>
					<SelectItem value="40">40</SelectItem>
					<SelectItem value="42">42</SelectItem>
					<SelectItem value="45">45</SelectItem>
					<SelectItem value="50">50</SelectItem>
					<SelectItem value="55">55</SelectItem>
					<SelectItem value="60">60</SelectItem>
					<SelectItem value="65">65</SelectItem>
					<SelectItem value="70">70</SelectItem>
					<SelectItem value="75">75</SelectItem>
					<SelectItem value="80">80</SelectItem>
					<SelectItem value="85">85</SelectItem>
					<SelectItem value="90">90</SelectItem>
					<SelectItem value="95">95</SelectItem>
					<SelectItem value="100">100</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

function HideReadFeedContentForm({
	hideReadFeedContent,
}: {
	hideReadFeedContent: boolean;
}): React.JSX.Element {
	const t = useTranslations("settings.viewSection");
	const [value, setValue] = useOptimistic(hideReadFeedContent);

	const handleCheckedChange = (checked: boolean) => {
		startTransition(async () => {
			try {
				setValue(checked);
				toast.success(t("success"));
				const res = await setHideReadFeedContent(checked);
				if (res.errors) {
					setValue(hideReadFeedContent);
					toast.error(res.errors.hideRead?.join());
					return;
				}

				if (res.errI18Key) {
					setValue(hideReadFeedContent);
					// biome-ignore lint/suspicious/noExplicitAny: valid type.
					toast.error(t(res.errI18Key as any));
					return;
				}
			} catch (err) {
				setValue(hideReadFeedContent);
				if (err instanceof Error) {
					toast.error(err.message);
				} else {
					toast.error(t("errors.unexpected"));
				}
			}
		});
	};

	return (
		<div className="flex justify-between items-center gap-4">
			<div className={SPACING.XS}>
				<Label className="font-bold text-base" htmlFor="hide-switch">
					{t("hide.title")}
				</Label>
				<p className="text-sm text-muted-foreground">{t("hide.description")}</p>
			</div>

			<Switch
				id="hide-switch"
				checked={value}
				onCheckedChange={handleCheckedChange}
			/>
		</div>
	);
}
