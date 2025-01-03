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
import { useTranslations } from "next-intl";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";

export function FeedContentLimitForm({
	feedContentLimit,
}: { feedContentLimit: number }): React.JSX.Element {
	const [value, setValue] = useOptimistic(feedContentLimit);

	const handleFeedLimit = (e: string): void => {
		startTransition(async () => {
			try {
				setValue(Number.parseInt(e));
				const res = await setFeedContentLimit(e);

				if (res.message) {
					toast.error(t(res.message));
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
		<div className="flex items-center justify-between gap-4 border rounded-md p-3">
			<div className={SPACING.SM}>
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
				</SelectContent>
			</Select>
		</div>
	);
}
