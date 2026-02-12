import type { Metadata } from "next";
import { type Locale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense, use } from "react";
import { Settings } from "@/app/[locale]/ui/settings/settings";
import { SettingsSkeleton } from "@/app/[locale]/ui/skeletons";
import { Separator } from "@/components/ui/separator";
import { dal } from "@/lib/dal";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale as Locale,
		namespace: "metadata",
	});

	return {
		title: t("settings.title"),
		description: t("settings.description"),
	} satisfies Metadata;
}

export default function Page({
	params,
}: PageProps<"/[locale]/d/settings">): React.JSX.Element {
	const { locale } = use(params);
	setRequestLocale(locale as Locale);
	const t = useTranslations("settings");
	const sess = dal.verifySession();

	return (
		<>
			<section>
				<h1 className="font-semibold tracking-tight text-3xl">{t("title")}</h1>
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<SettingsSkeleton />}>
				<Settings sess={sess} />
			</Suspense>
		</>
	);
}
