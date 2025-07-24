export default function LegalLayout({
	children,
}: {
	children: React.ReactNode
}): React.JSX.Element {
	return (
		<div className="py-5 mb-6 mx-auto px-4">
			<main>{children}</main>
		</div>
	)
}
