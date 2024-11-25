import { BocalLogo } from "@/app/[locale]/ui/bocal-logo";
import { Link } from "@/i18n/routing";
import { ThemeToggle } from "./ui/theme-toggle";

export function NavBar() {
	return (
		<nav className="mb-12 py-5 flex items-center gap-4">
			<Link href="/" className="tracking-tight">
				<BocalLogo />
			</Link>
			<ThemeToggle />
		</nav>
	);
}
