import { getLinks } from "../../lib/data";

export async function Links(): Promise<React.JSX.Element> {
	const _links = await getLinks();
	return <section>test</section>;
}
