"use client";
import { usermailfuncs } from "@/app/[locale]/lib/usermail-funcs";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FeedWithContent } from "@/db/schema";
import { useTranslations } from "next-intl";
import { TbCopy, TbNews } from "react-icons/tb";
import { toast } from "sonner";

export function NewsletterItem({
	item,
}: { item: FeedWithContent }): React.JSX.Element {
	const t = useTranslations("newsletter");
	function copyToClipboard(text: string): void {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success(t("copiedToClipboard"));
			})
			.catch(() => {
				toast.error(t("failedToCopyToClipboard"));
			});
	}

	return (
		<div className={SPACING.MD}>
			<h2
				className="tracking-tight text-xl font-semibold line-clamp-3
        flex items-center gap-2"
			>
				<TbNews />
				{item.title}
			</h2>

			<div className={SPACING.MD}>
				<div className={SPACING.SM}>
					<Label
						htmlFor={`url-${item.id}`}
						className="block text-sm font-medium"
					>
						{t("descFeedUrl")}
					</Label>

					<div className="flex items-center gap-2">
						<Input
							value={item.url}
							disabled
							className="block w-full rounded-md py-2"
							id={`url-${item.id}`}
						/>

						<Button
							onClick={(): void => copyToClipboard(item.url)}
							variant="outline"
							size="icon"
						>
							<TbCopy />
						</Button>
					</div>
				</div>

				<div className={SPACING.SM}>
					<Label
						htmlFor={`email-${item.id}`}
						className="block text-sm font-medium"
					>
						{t("descUsermail")}
					</Label>

					<div className="flex items-center gap-2">
						<Input
							value={usermailfuncs.format(item.eid)}
							disabled
							className="block w-full rounded-md py-2"
							id={`email-${item.id}`}
						/>
						<Button
							onClick={(): void =>
								copyToClipboard(usermailfuncs.format(item.eid))
							}
							variant="outline"
							size="icon"
						>
							<TbCopy />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
