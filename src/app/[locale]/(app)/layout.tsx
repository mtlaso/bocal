import { NavMenu } from "../ui/navigation-menu";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<div className="min-h-screen max-w-6xl mx-auto px-4 mb-12">
			<NavMenu />
			<main>{children}</main>
		</div>
	);
}
