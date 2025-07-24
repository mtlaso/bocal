import { getAppBaseURL } from "@/app/[locale]/lib/get-app-base-url"
import "@/app/[locale]/ui/globals.css"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import BaseLayout from "@/components/ui/base-layout"
import { routing } from "@/i18n/routing"

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: "metadata" })

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
	} satisfies Metadata
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>): Promise<React.JSX.Element> {
	const locale = (await params).locale

	// biome-ignore lint/suspicious/noExplicitAny: locale exception.
	if (!routing.locales.includes(locale as any)) {
		notFound()
	}

	setRequestLocale(locale)

	return <BaseLayout locale={locale}>{children}</BaseLayout>
}
