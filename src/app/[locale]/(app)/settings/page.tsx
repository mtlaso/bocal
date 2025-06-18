import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Settings } from "@/app/[locale]/ui/settings/settings";
import { SettingsSkeleton } from "@/app/[locale]/ui/skeletons";
import { Separator } from "@/components/ui/separator";
export const experimental_ppr = true;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata.settings" });

	return {
		title: t("title"),
		description: t("description"),
	} satisfies Metadata;
}

export default function Page(): React.JSX.Element {
	const t = useTranslations("settings");

	return (
		<>
			<section className="flex justify-between">
				<h1 className="font-semibold tracking-tight text-3xl">{t("title")}</h1>
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<SettingsSkeleton />}>
				<Settings />
			</Suspense>
		</>
	);
}
