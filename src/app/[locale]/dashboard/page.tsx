import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { AddLinkForm } from "../ui/dashboard/add-link-form";
import { Links } from "../ui/dashboard/links";
import { lusitana } from "../ui/fonts";
import { LinksSkeleton } from "../ui/skeletons";

export default function Page(): React.JSX.Element {
	const t = useTranslations("dashboard");
	return (
		<>
			<section className="flex justify-between">
				<div className="flex gap-2">
					<h1
						className={`${lusitana.className} font-semibold tracking-tight text-3xl`}
					>
						{t("links")}
					</h1>
					<AddLinkForm />
				</div>
			</section>

			<Separator className="my-4" />

			<section>
				<Suspense fallback={<LinksSkeleton />}>
					<Links />
				</Suspense>
			</section>
		</>
	);
}
