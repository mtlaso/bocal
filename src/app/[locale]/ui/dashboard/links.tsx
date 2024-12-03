import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { getLinks } from "../../lib/data";
import { LinksContextMenu } from "./links-context-menu";

export async function Links(): Promise<React.JSX.Element> {
	const links = await getLinks();
	const t = await getTranslations("dashboard");

	const removeWWW = (url: string): string => {
		if (url.startsWith("www.")) {
			return url.slice(4);
		}

		return url;
	};

	const randomBackground = (firstLetter: string): string => {
		const letter = firstLetter.toUpperCase();
		const charCode = letter.charCodeAt(0);

		if (charCode >= 65 && charCode <= 68) {
			return "from-[#FFB6B9] to-[#FF79C6]";
		}

		if (charCode >= 69 && charCode <= 72) {
			return "from-red-200 to-indigo-600";
		}

		return "from-emerald-300 to-violet-700";
	};

	return (
		<section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
			{links.map((item) => (
				<Card
					key={item.id}
					className="grid grid-rows-subgrid row-span-3 hover:shadow-md
				dark:hover:shadow-2xl transition-all duration-200"
				>
					<CardHeader className="!p-0">
						<Link href={item.url} target="_blank">
							{item.ogImageURL ? (
								<Image
									className="aspect-video h-auto w-full rounded-t-xl"
									src={item.ogImageURL}
									width={500}
									height={500}
									priority={false}
									alt={t("ogImageAlt")}
								/>
							) : (
								<div
									className={cn(
										`aspect-video h-auto w-full rounded-t-xl
										bg-gradient-to-br`,
										randomBackground(item.ogTitle ?? item.url),
									)}
								>
									<span className="text-2xl text-white font-semibold">
										{item.ogTitle?.charAt(0).toUpperCase()}
									</span>
								</div>
							)}
						</Link>
					</CardHeader>

					<CardContent>
						<CardTitle>
							<Link href={item.url} target="_blank" className="line-clamp-3">
								{item.ogTitle ?? new URL(item.url).host}
							</Link>
						</CardTitle>
					</CardContent>

					<CardFooter className="flex justify-between">
						<Link
							href={item.url}
							target="_blank"
							className="text-sm text-muted-foreground"
						>
							{removeWWW(new URL(item.url).host)}
						</Link>

						<LinksContextMenu id={item.id.toString()} />
					</CardFooter>
				</Card>
			))}
		</section>
	);
}
