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
import { LinksContextMenu } from "./links-context-menu";

type Props = {
	links: {
		id: number;
		url: string;
		ogTitle: string | null;
		ogImageURL: string | null;
	}[];
};

export async function Links({ links }: Props): Promise<React.JSX.Element> {
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
					className="grid grid-rows-subgrid row-span-3
					hover:shadow-md dark:hover:shadow-xl transition-all duration-200"
				>
					<CardHeader className="!p-0 relative">
						<Link href={item.url} target="_blank">
							{item.ogImageURL ? (
								<Image
									className="aspect-video h-auto w-full rounded-t-xl object-cover"
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
										select-none text-9xl text-foreground font-semibold
										bg-gradient-to-br`,
										randomBackground(
											item.ogTitle ?? removeWWW(new URL(item.url).host),
										),
									)}
								/>
							)}
						</Link>
					</CardHeader>

					<CardContent className="relative z-30">
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
