import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { APP_ROUTES } from "@/app/[locale]/lib/constants";
import { dal } from "@/app/[locale]/lib/dal";
import { Settings } from "@/app/[locale]/ui/settings/settings";
import { SettingsSkeleton } from "@/app/[locale]/ui/skeletons";
import { Separator } from "@/components/ui/separator";
import { redirect } from "@/i18n/routing";
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
	const [t, sess, locale] = await Promise.all([
		getTranslations("settings"),
		dal.verifySession(),
		getLocale(),
	]);
	if (!sess) return redirect({ href: APP_ROUTES.login, locale: locale });

	return (
		<>
			<section>
				<h1 className="font-semibold tracking-tight text-3xl">{t("title")}</h1>
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<SettingsSkeleton />}>
				<Settings user={sess.user} />
			</Suspense>
		</>
	);
}
