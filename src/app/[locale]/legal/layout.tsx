import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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

export default function LegalLayout({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<div className="py-5 mb-6 mx-auto px-4">
			<main>{children}</main>
		</div>
	);
}
