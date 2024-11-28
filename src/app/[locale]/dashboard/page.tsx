import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { AddLinkForm } from "../ui/dashboard/add-link-form";
import { lusitana } from "../ui/fonts";

export default function Page(): React.JSX.Element {
	const t = useTranslations("dashboard");
	return (
		<main className="min-h-screen max-w-2xl mx-auto px-4">
			<section className="flex gap-2">
				<h1
					className={`${lusitana.className} font-semibold tracking-tight text-3xl`}
				>
					{t("links")}
				</h1>
				<AddLinkForm />
			</section>

			<Separator className="my-4" />
			<section>links...</section>
		</main>
	);
}
