import { lusitana } from "./fonts";

export function BocalLogo({ className }: { className?: string }) {
	return (
		<p className={`${className} ${lusitana.className} font-extrabold`}>Bocal</p>
	);
}
