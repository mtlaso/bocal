import { getUserData } from "@/app/[locale]/lib/data";
import { Settings } from "@/app/[locale]/ui/settings/settings";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
	const user = await getUserData();

	return (
		<>
			<section className="flex justify-between">
				<h1 className="font-semibold tracking-tight text-3xl">{t("title")}</h1>
			</section>

			<Separator className="my-4" />

			<Settings
				email={user.email}
				name={user.name}
				feedContentLimit={user.feedContentLimit}
			/>
		</>
	);
}
