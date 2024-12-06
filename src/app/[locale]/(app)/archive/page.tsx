import { SortLinks } from "@/app/[locale]/ui/sort-links";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { getLinks } from "../../lib/data";
import { lusitana } from "../../ui/fonts";
import { Links } from "../../ui/links";
import { LinksSkeleton } from "../../ui/skeletons";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ sort?: string }>;
}): Promise<React.JSX.Element> {
	const { sort } = await searchParams;
	const t = await getTranslations("archive");
	const links = await getLinks({ archivedLinksOnly: true, sort });
	return (
		<>
			<section className="flex justify-between">
				<div className="flex gap-2">
					<h1
						className={`${lusitana.className} font-semibold tracking-tight text-3xl`}
					>
						{t("archive")}
					</h1>
				</div>

				<SortLinks />
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<LinksSkeleton />}>
				<Links links={links} />
			</Suspense>
		</>
	);
}
