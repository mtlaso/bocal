import { lusitana } from "./fonts";

export function BocalLogo({
	className,
}: {
	className?: string;
}): React.JSX.Element {
	return (
		<p className={`${className} ${lusitana.className} font-extrabold`}>Bocal</p>
	);
}
