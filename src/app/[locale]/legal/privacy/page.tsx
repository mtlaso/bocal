import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

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
		title: t("privacyPolicy.title"),
		description: t("privacyPolicy.description"),
	} satisfies Metadata;
}

export default async function HomePage({
	params,
}: PageProps<"/[locale]/legal/privacy">): Promise<React.JSX.Element> {
	try {
		const { locale } = await params;
		setRequestLocale(locale as Locale);
		const Content = (await import(`./${locale}.mdx`)).default;
		return (
			<section className="prose dark:prose-invert mx-auto">
				<Content />
			</section>
		);
	} catch (_error) {
		notFound();
	}
}
