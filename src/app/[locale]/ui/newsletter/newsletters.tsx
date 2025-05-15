import { NewsletterItem } from "@/app/[locale]/ui/newsletter/newsletter-item";
import { SPACING } from "@/app/[locale]/ui/spacing";
import type { FeedWithContent } from "@/db/schema";
import { cn } from "@/lib/utils";

type Props = {
	newsletters: FeedWithContent[];
};

export function Newsletters({ newsletters }: Props): React.JSX.Element {
	return (
		<section className={cn("break-words", SPACING.LG)}>
			{newsletters.map((newsletter) => (
				<NewsletterItem key={newsletter.id} item={newsletter} />
			))}
		</section>
	);
}
