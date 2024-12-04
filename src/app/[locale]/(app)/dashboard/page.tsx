import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { getLinks } from "../../lib/data";
import { AddLinkForm } from "../../ui/dashboard/add-link-form";
import { lusitana } from "../../ui/fonts";
import { Links } from "../../ui/links";
import { LinksSkeleton } from "../../ui/skeletons";

export default async function Page(): Promise<React.JSX.Element> {
	const t = await getTranslations("dashboard");
	const links = await getLinks({});

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

			<Suspense fallback={<LinksSkeleton />}>
				<Links links={links} />
			</Suspense>
		</>
	);
}
