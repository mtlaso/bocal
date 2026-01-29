"use client";
import { useTranslations } from "next-intl";
import { TbLogout } from "react-icons/tb";
import { toast } from "sonner";
import { authClient } from "@/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

export function LogoutForm(): React.JSX.Element {
	const t = useTranslations("logout");
	const router = useRouter();
	return (
		<Button
			onClick={async (): Promise<void> => {
				toast.info(t("loggingOut"), { duration: 1500 });
				await authClient.signOut({
					fetchOptions: {
						onSuccess: () => {
							router.push("/");
						},
					},
				});
			}}
			type="submit"
			variant="outline"
			size="icon"
		>
			<TbLogout />
		</Button>
	);
}
