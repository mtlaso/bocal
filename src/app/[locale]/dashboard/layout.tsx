import { NavMenu } from "../ui/dashboard/navigation-menu";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<div className="min-h-screen max-w-2xl mx-auto px-4">
			<NavMenu />
			<main>{children}</main>
		</div>
	);
}
