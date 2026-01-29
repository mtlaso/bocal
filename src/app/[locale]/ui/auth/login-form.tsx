"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { authClient } from "@/auth-client";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/lib/constants";

export function LoginForm(): React.JSX.Element {
	const t = useTranslations("login");
	const [isDisabled, setIsDisabled] = useState(false);
	const [redirectingMsg, setRedirectingMsg] = useState("");

	return (
		<form className={`${SPACING.LG} `}>
			<h1 className="text-center">{t("title")}</h1>

			<div className="flex flex-col gap-2">
				<Button
					disabled={isDisabled}
					onClick={async () => {
						setIsDisabled(true);
						await authClient.signIn.social({
							provider: "google",
							callbackURL: APP_ROUTES.links,
						});
						setIsDisabled(false);
						setRedirectingMsg(t("redirecting"));
					}}
				>
					<FaGoogle className="text-white" />
					{t("google")}
				</Button>

				<Button
					disabled={isDisabled}
					className="text-white bg-[#24292e] dark:bg-[#24292e]"
					onClick={async () => {
						setIsDisabled(true);
						await authClient.signIn.social({
							provider: "github",
							callbackURL: APP_ROUTES.links,
							scopes: ["read:user", "user:email"],
						});
						setIsDisabled(false);
						setRedirectingMsg(t("redirecting"));
					}}
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
