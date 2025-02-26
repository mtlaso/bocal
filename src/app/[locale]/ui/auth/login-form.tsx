"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { authenticate } from "../../lib/actions";
import { SPACING } from "../spacing";

export function LoginForm(): React.JSX.Element {
	const t = useTranslations("login");

	const handleProviderSignIn = async (
		e: React.MouseEvent,
		provider: string,
	): Promise<void> => {
		try {
			e.preventDefault();
			const res = await authenticate(provider);

			if (typeof res === "string") {
				toast.error(t("errors.title"), {
					description: t(res),
				});
				return;
			}
		} catch (_err) {
			toast.error(t("errors.unexpected.title"), {
				description: t("errors.unexpected.description"),
			});
		}
	};

	return (
		<form className={`${SPACING.MD} `}>
			<h1 className="text-center">{t("title")}</h1>

			<div className="flex flex-col gap-2">
				<Button
					className="text-white bg-[#4285F4]"
					onClick={(e): Promise<void> => handleProviderSignIn(e, "google")}
				>
					<FaGoogle className="text-white" />
					{t("google")}
				</Button>

				<Button
					className="text-white bg-[#24292e] dark:bg-[#24292e]"
					onClick={(e): Promise<void> => handleProviderSignIn(e, "github")}
				>
					<FaGithub className="text-white" />
					{t("github")}
				</Button>
			</div>
		</form>
	);
}
