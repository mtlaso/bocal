import "@/app/[locale]/ui/globals.css";
import BaseLayout from "@/components/ui/base-layout";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: {
			template: `%s | ${t("title")}`,
			default: "Bocal",
		},
		description: t("description"),
	} satisfies Metadata;
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>): Promise<React.JSX.Element> {
	const locale = (await params).locale;

	// biome-ignore lint/suspicious/noExplicitAny: locale exception.
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
