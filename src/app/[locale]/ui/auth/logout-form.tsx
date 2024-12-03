import { Button } from "@/components/ui/button";
import { TbLogout } from "react-icons/tb";
import { logout } from "../../lib/actions";

export function LogoutForm(): React.JSX.Element {
	return (
		<form action={logout}>
			<Button type="submit" variant="outline" size="icon">
				<TbLogout />
			</Button>
		</form>
	);
}
