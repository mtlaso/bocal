import { SortLinks } from "@/app/[locale]/ui/sort-links";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getLinks } from "../../lib/data";
import { Links } from "../../ui/links";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata.archive" });

	return {
		title: t("title"),
		description: t("description"),
	} satisfies Metadata;
}

export default async function Page(): Promise<React.JSX.Element> {
	const t = await getTranslations("archive");
	const links = await getLinks({ archivedLinksOnly: true });

	return (
		<>
			<section className="flex justify-between">
				<div className="flex gap-2">
					<h1 className="font-semibold tracking-tight text-3xl">
						{t("archive")}
					</h1>
				</div>

				<SortLinks />
			</section>

			<Separator className="my-4" />

			<Links links={links} view={"grid"} />
		</>
	);
}
