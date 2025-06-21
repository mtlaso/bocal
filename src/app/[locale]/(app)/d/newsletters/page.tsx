import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { dal } from "@/app/[locale]/lib/dal";
import { AddNewsletterForm } from "@/app/[locale]/ui/newsletter/add-newsletter-form";
import { Newsletters } from "@/app/[locale]/ui/newsletter/newsletters";
import { NewsletterSkeleton } from "@/app/[locale]/ui/skeletons";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Separator } from "@/components/ui/separator";

export const experimental_ppr = true;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata.newsletter" });
	return {
		title: t("title"),
		description: t("description"),
	} satisfies Metadata;
}

export default function Page(): React.JSX.Element {
	const t = useTranslations("newsletter");
	return (
		<>
			<section className={SPACING.SM}>
				<div className="flex gap-2">
					<h1 className="font-semibold tracking-tight text-3xl">
						{t("newsletters")}
					</h1>
					<AddNewsletterForm />
				</div>

				<p className="text-sm text-muted-foreground">{t("description")}</p>
			</section>

			<Separator className="my-4" />

			<Suspense fallback={<NewsletterSkeleton />}>
				<NewsLetterWrapper />
			</Suspense>
		</>
	);
}

async function NewsLetterWrapper(): Promise<React.JSX.Element> {
	const newsletters = await dal.getUserFeeds({ onlyNewsletters: true });
	return <Newsletters newsletters={newsletters} />;
}
