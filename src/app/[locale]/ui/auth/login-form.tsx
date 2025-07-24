"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { FaGithub, FaGoogle } from "react-icons/fa"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { authenticate } from "../../lib/actions"
import { SPACING } from "../spacing"

export function LoginForm(): React.JSX.Element {
	const t = useTranslations("login")
	const [isDisabled, setIsDisabled] = useState(false)
	const [redirectingMsg, setRedirectingMsg] = useState("")

	const handleProviderSignIn = async (e: React.MouseEvent, provider: string): Promise<void> => {
		try {
			setIsDisabled(true)
			setRedirectingMsg("")
			e.preventDefault()
			const res = await authenticate(provider)

			if (typeof res === "string") {
				toast.error(t("errors.title"), {
					description: t(res),
				})
				return
			}

			setRedirectingMsg(t("redirecting"))
		} catch (_err) {
			toast.error(t("errors.unexpected.title"), {
				description: t("errors.unexpected.description"),
			})
		} finally {
			setIsDisabled(false)
		}
	}

	return (
		<form className={`${SPACING.LG} `}>
			<h1 className="text-center">{t("title")}</h1>

			<div className="flex flex-col gap-2">
				<Button
					disabled={isDisabled}
					className="text-white bg-[#4285F4]"
					onClick={(e): Promise<void> => handleProviderSignIn(e, "google")}
				>
					<FaGoogle className="text-white" />
					{t("google")}
				</Button>

				<Button
					disabled={isDisabled}
					className="text-white bg-[#24292e] dark:bg-[#24292e]"
					onClick={(e): Promise<void> => handleProviderSignIn(e, "github")}
				>
					<FaGithub className="text-white" />
					{t("github")}
				</Button>
			</div>

			<p className="text-center text-sm text-muted-foreground animate-pulse">{redirectingMsg}</p>
		</form>
	)
}
