"use client";
import { useTranslations } from "next-intl";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import { setFeedContentLimit } from "@/app/[locale]/lib/actions";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function ViewSection({
	feedContentLimit,
}: {
	feedContentLimit: number;
}): React.JSX.Element {
	const t = useTranslations("settings.viewSection");

	return (
		<section className={cn("mb-12", SPACING.LG)}>
			<h1 className="text-xl font-medium">{t("title")}</h1>

			<FeedContentLimitForm feedContentLimit={feedContentLimit} />
		</section>
	);
}

export function FeedContentLimitForm({
	feedContentLimit,
}: {
	feedContentLimit: number;
}): React.JSX.Element {
	const [value, setValue] = useOptimistic(feedContentLimit);

	const handleFeedLimit = (e: string): void => {
		startTransition(async () => {
			try {
				setValue(Number.parseInt(e));
				const res = await setFeedContentLimit(e);

				if (res.errMessage) {
					toast.error(t(res.errMessage));
					return;
				}

				toast.success(t("success"));
			} catch (_err) {
				setValue(feedContentLimit);
				toast.error(t("errors.unexpected"));
			}
		});
	};

	const t = useTranslations("settings.viewSection");

	return (
		<div className="flex items-center justify-between gap-4 border rounded-md p-4">
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
