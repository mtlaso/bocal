import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Settings } from "@/app/[locale]/ui/settings/settings";
import { SettingsSkeleton } from "@/app/[locale]/ui/skeletons";
import { auth } from "@/auth";
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

export default async function Page(): Promise<React.JSX.Element> {
	const t = await getTranslations("settings");
	const sess = await auth();

	console.log(sess);

	return (
		<>
			<section>
				<h1 className="font-semibold tracking-tight text-3xl">{t("title")}</h1>
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<SettingsSkeleton />}>
				<Settings />
			</Suspense>
		</>
	);
}
