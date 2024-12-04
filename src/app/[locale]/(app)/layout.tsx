import { NavMenu } from "../ui/navigation-menu";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<div className="min-h-screen max-w-2xl mx-auto px-4">
			// TODO: quand on clic sur un lien dans le menu mobile, // fermer le menu
			<NavMenu />
			<main>{children}</main>
		</div>
	);
}
