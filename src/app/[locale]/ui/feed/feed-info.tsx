import type { Feed } from "@/db/schema";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type Props = {
	feeds: Feed[];
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
};

export function FeedInfo({ feeds, className }: Props): React.JSX.Element {
	const t = useTranslations("rssFeed.info");
	const totalFeeds = feeds.length;
	const unreachableFeeds = feeds.filter((feed) => feed.errorType !== null);

	return (
		<p className={className}>
			<span>{t("textPartOne")}&nbsp;</span>
			<Link className="underline" href="#">
				{t("textFeedsCount", { count: totalFeeds })}
			</Link>
			<span>&nbsp;{t("textPartTwo")}&nbsp;</span>
			<Link className="underline" href="#">
				{t("textUnreachableCount", { count: unreachableFeeds.length })}
			</Link>
		</p>
	);
}
