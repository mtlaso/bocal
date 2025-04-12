"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { TbLogout } from "react-icons/tb";
import { toast } from "sonner";
import { logout } from "../../lib/actions";

export function LogoutForm(): React.JSX.Element {
	const t = useTranslations("logout");
	return (
		<form action={logout}>
			<Button
				onClick={(): void => {
					toast.info(t("loggingOut"), { duration: 1500 });
				}}
				type="submit"
				variant="outline"
				size="icon"
			>
				<TbLogout />
			</Button>
		</form>
	);
}
