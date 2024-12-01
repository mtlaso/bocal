import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { getLinks } from "../../lib/data";

export async function Links(): Promise<React.JSX.Element> {
	const links = await getLinks();
	const t = await getTranslations("dashboard");

	return (
		<section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
			{links.map((item) => (
				<Card key={item.id} className="grid grid-rows-subgrid row-span-3">
					<CardHeader className="!p-0">
						<Image
							className="aspect-video h-auto w-full rounded-t-xl"
							src={item.ogImageURL ?? "https://placeholder.co/500"}
							width={500}
							height={500}
							alt={t("ogImageAlt")}
						/>
					</CardHeader>

					<CardContent>
						<p className="line-clamp-3">{item.ogTitle ?? new URL(item.url).host}</p>
					</CardContent>

					<CardFooter className="pt-0">
						<p className="text-sm text-muted-foreground">
							{new URL(item.url).host}
						</p>
					</CardFooter>
				</Card>
			))}
		</section>
	);
}
