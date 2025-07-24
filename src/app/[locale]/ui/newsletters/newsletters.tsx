import { useTranslations } from "next-intl"
import { NewsletterItem } from "@/app/[locale]/ui/newsletters/newsletter-item"
import { SPACING } from "@/app/[locale]/ui/spacing"
import type { Feed } from "@/db/schema"
import { cn } from "@/lib/utils"

type Props = {
	newsletters: Feed[]
}

export function Newsletters({ newsletters }: Props): React.JSX.Element {
	const t = useTranslations("newsletter")
	return (
		<section className={cn("flex flex-col gap-4", SPACING.MD)}>
			<details className={SPACING.MD}>
				<summary className="tracking-tight text-xl font-semibold">{t("explanation.title")}</summary>
				<div>
					<p>{t("explanation.part1")}</p>
					<p className="mb-4">{t("explanation.part2")}</p>
					<p>{t("explanation.part3")}</p>
				</div>
			</details>

			{newsletters.map((newsletter) => (
				<NewsletterItem key={newsletter.id} item={newsletter} />
			))}
		</section>
	)
}
