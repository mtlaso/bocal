import { type Locale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { LoginForm } from "@/app/[locale]/ui/auth/login-form";

export default function Page({
	params,
}: PageProps<"/[locale]">): React.JSX.Element {
	const { locale } = use(params);
	setRequestLocale(locale as Locale);
	const t = useTranslations("metadata");
	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<p className="font-extrabold text-2xl">{t("title")}</p>
			<LoginForm />
		</main>
	);
}
