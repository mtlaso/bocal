import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
export const experimental_ppr = true;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "metadata.privacyPolicy",
	});

	return {
		title: t("title"),
		description: t("description"),
	} satisfies Metadata;
}

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<React.JSX.Element> {
	try {
		const { locale } = await params;
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
