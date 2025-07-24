import { useTranslations } from "next-intl"
import { LoginForm } from "../ui/auth/login-form"
export const experimental_ppr = true

export default function Page(): React.JSX.Element {
	const t = useTranslations("metadata")
	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<p className="font-extrabold text-2xl">{t("title")}</p>
			<LoginForm />
		</main>
	)
}
