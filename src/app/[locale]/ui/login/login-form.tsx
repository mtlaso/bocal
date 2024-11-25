"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { authenticate } from "../../lib/actions";
import { lusitana } from "../fonts";
import { SPACING } from "../spacing";

export function LoginForm() {
	const t = useTranslations("login");

	const handleProviderSignIn = async (
		e: React.MouseEvent,
		provider: string,
	) => {
		try {
			e.preventDefault();
			const res = await authenticate(provider);

			if (typeof res === "string") {
				toast.error(t("error.title"), {
					description: t(res),
				});
				return;
			}
		} catch (err) {
			console.error(err);
			toast.error(t("error.unexpected.title"), {
				description: t("error.unexpected.description"),
			});
		}
	};

	return (
		<form className={`${SPACING.INSIDE_SECTIONS_SPACING} `}>
			<h1 className={`${lusitana.className} text-center`}>{t("title")}</h1>

			<div className="flex flex-col gap-2">
				<Button
					className="text-white bg-[#4285F4]"
					onClick={(e) => handleProviderSignIn(e, "google")}
				>
					<FaGoogle className="text-white" />
					{t("google")}
				</Button>

				<Button
					className="text-white bg-[#24292e] dark:bg-[#24292e]"
					onClick={(e) => handleProviderSignIn(e, "github")}
				>
					<FaGithub className="text-white" />
					{t("github")}
				</Button>
			</div>
		</form>
	);
}
