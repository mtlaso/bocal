import { lusitana } from "@/app/[locale]/ui/fonts";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export default function Page(): React.JSX.Element {
	const t = useTranslations("rssFeed");
	return (
		<>
			<section className="flex justify-between">
				<h1
					className={`${lusitana.className} font-semibold tracking-tight text-3xl`}
				>
					{t("rssFeed")}
				</h1>
			</section>

			<Separator className="my-4" />

			<p>content here...</p>
		</>
	);
}
