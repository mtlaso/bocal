import { AppNavigationMenu } from "@/app/[locale]/ui/app-navigation-menu";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<div className="min-h-screen max-w-6xl mx-auto px-4 mb-12">
			<AppNavigationMenu />
			<main>{children}</main>
		</div>
	);
}
