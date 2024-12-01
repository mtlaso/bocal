import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { getLinks } from "../../lib/data";

export async function Links(): Promise<React.JSX.Element> {
	const links = await getLinks();
	const t = await getTranslations("dashboard");

	const removeWWW = (url: string): string => {
		if (url.startsWith("www.")) {
			return url.slice(4);
		}

		return url;
	};

	return (
		<section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
			{links.map((item) => (
				<Card key={item.id} className="grid grid-rows-subgrid row-span-3">
					<CardHeader className="!p-0">
						<Link href={item.url} target="_blank">
							<Image
								className="aspect-video h-auto w-full rounded-t-xl"
								src={item.ogImageURL ?? "https://placeholder.co/500"}
								width={500}
								height={500}
								priority={false}
								alt={t("ogImageAlt")}
							/>
						</Link>
					</CardHeader>

					<CardContent>
						<CardTitle>
							<Link href={item.url} target="_blank" className="line-clamp-3">
								{item.ogTitle ?? new URL(item.url).host}
							</Link>
						</CardTitle>
					</CardContent>

					<CardFooter>
						<Link
							href={item.url}
							target="_blank"
							className="text-sm text-muted-foreground"
						>
							{removeWWW(new URL(item.url).host)}
						</Link>
					</CardFooter>
				</Card>
			))}
		</section>
	);
}
