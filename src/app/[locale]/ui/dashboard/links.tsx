import { getLinks } from "../../lib/data";

export async function Links(): Promise<React.JSX.Element> {
	const links = await getLinks();
	return (
		<section>
			<ul>
				{links.map((item) => (
					<li key={item.id}>{item.url}</li>
				))}
			</ul>
		</section>
	);
}
