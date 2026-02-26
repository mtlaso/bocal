"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Button } from "@/components/ui/button";
import { authenticate } from "@/lib/actions";

export function LoginForm(): React.JSX.Element {
	const t = useTranslations("login");
	const [isDisabled, setIsDisabled] = useState(false);
	const [redirectingMsg, setRedirectingMsg] = useState("");

	const handleProviderSignIn = async (
		e: React.MouseEvent,
		provider: string,
	): Promise<void> => {
		try {
			setIsDisabled(true);
			setRedirectingMsg(t("redirecting"));
			e.preventDefault();
			await authenticate(provider);
		} catch (err) {
			// Ignorer erreurs NEXT_REDIRECT par auth.js pendant la redirection.
			const isNextRedirect =
				err instanceof Error &&
				(((err as Error & { digest?: string }).digest?.startsWith(
					"NEXT_REDIRECT;",
				) ??
					false) ||
					err.message === "NEXT_REDIRECT");
			if (!isNextRedirect) {
				toast.error(t("errors.unexpected"));
				setRedirectingMsg("");
			}
		} finally {
			setIsDisabled(false);
		}
	};

	return (
		<form className={`${SPACING.LG}`}>
			<h1 className="text-center">{t("title")}</h1>

			<div className="flex flex-col gap-2">
				<Button
					disabled={isDisabled}
					onClick={(e): Promise<void> => handleProviderSignIn(e, "google")}
					className="dark:bg-white dark:hover:bg-gray-200"
				>
					<FaGoogle />
					{t("google")}
				</Button>

				<Button
					disabled={isDisabled}
					className="text-white bg-[#24292e] dark:hover:bg-gray-700"
					onClick={(e): Promise<void> => handleProviderSignIn(e, "github")}
				>
					<FaGithub className="text-white" />
					{t("github")}
				</Button>
			</div>

			<p className="text-center text-sm text-muted-foreground animate-pulse">
				{redirectingMsg}
			</p>
		</form>
	);
}
