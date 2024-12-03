import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { TbLogout } from "react-icons/tb";

export function LogoutForm(): React.JSX.Element {
	return (
		<form
			action={async (): Promise<void> => {
				"use server";
				await signOut({
					redirectTo: "/",
				});
			}}
		>
			<Button type="submit" variant="outline" size="icon">
				<TbLogout />
			</Button>
		</form>
	);
}
