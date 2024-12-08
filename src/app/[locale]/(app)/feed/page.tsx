import { AddFeedForm } from "@/app/[locale]/ui/feed/add-feed-form";
import { lusitana } from "@/app/[locale]/ui/fonts";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export default function Page(): React.JSX.Element {
	const t = useTranslations("rssFeed");
	return (
		<>
			<section className="flex justify-between">
				<div className="flex gap-2">
					<h1
						className={`${lusitana.className} font-semibold tracking-tight text-3xl`}
					>
						{t("rssFeed")}
					</h1>
					<AddFeedForm />
				</div>
			</section>

			<Separator className="my-4" />

			<p>content here...</p>
		</>
	);
}
