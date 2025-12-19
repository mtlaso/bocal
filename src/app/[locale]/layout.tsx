import "@/app/[locale]/ui/globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BaseLayout from "@/components/ui/base-layout";
import { routing } from "@/i18n/routing";
import { getAppBaseURL } from "@/lib/get-app-base-url";

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
		title: {
			template: `%s | ${t("title")}`,
			default: "Bocal",
		},
		description: t("description"),
		metadataBase: new URL(getAppBaseURL()),
		openGraph: {
			images: [
				{
					url: "/api/og",
					width: 1200,
					height: 630,
					alt: "open graph image",
				},
			],
		},
	} satisfies Metadata;
}

export async function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
	children,
	params,
}: LayoutProps<"/[locale]">): Promise<React.JSX.Element> {
	const { locale } = await params;
	if (!routing.locales.includes(locale as Locale)) {
		notFound();
	}
	setRequestLocale(locale as Locale);

	return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
