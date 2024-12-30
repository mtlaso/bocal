import { notFound } from "next/navigation";

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<React.JSX.Element> {
	try {
		const { locale } = await params;
		const Content = (await import(`./${locale}.mdx`)).default;
		return (
			<section className="prose dark:prose-invert mx-auto">
				<Content />
			</section>
		);
	} catch (_error) {
		notFound();
	}
}
