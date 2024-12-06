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
	view: "grid" | "list";
};

export async function Links({
	links,
	view,
}: Props): Promise<React.JSX.Element> {
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
		<section
			className={cn({
				"grid grid-cols-2 md:grid-cols-3 gap-4": view === "grid",
				"grid grid-cols-3 grid-rows-2 gap-4": view === "list",
			})}
		>
			{links.map((item) => (
				<Card
					key={item.id}
					className={cn(
						{
							"grid grid-rows-subgrid row-span-3 col-span-1": view === "grid",
							"grid grid-cols-subgrid col-span-3 row-span- items-center":
								view === "list",
						},
						"hover:shadow-md dark:hover:shadow-xl transition-all duration-200",
					)}
				>
					<CardHeader
						className={cn("!p-0", {
							"row-start- row-span-2": view === "list",
						})}
					>
						<Link href={item.url} target="_blank">
							{item.ogImageURL ? (
								<Image
									className="aspect-video h-auto w-full rounded-bl-xl rounded-tl-xl object-cover"
									src={item.ogImageURL}
									width={500}
									height={500}
									priority={false}
									alt={t("ogImageAlt")}
								/>
							) : (
								<div
									className={cn(
										`aspect-video h-auto w-full rounded-bl-xl rounded-tl-xl object-cover
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

					<CardContent
						className={cn({
							"row-start-1 col-start-2 col-span-2 p-0 ": view === "list",
						})}
					>
						<CardTitle>
							<Link href={item.url} target="_blank" className="line-clamp-3">
								{item.ogTitle ?? new URL(item.url).host}
							</Link>
						</CardTitle>
					</CardContent>

					<CardFooter
						className={cn("flex justify-between", {
							"row-start-2 col-start-2 col-span-2 pl-0": view === "list",
						})}
					>
						<Link
							href={item.url}
							target="_blank"
							className="text-sm text-muted-foreground"
						>
							{removeWWW(new URL(item.url).host)}
						</Link>

						<div>
							<LinksContextMenu id={item.id.toString()} />
						</div>
					</CardFooter>
				</Card>
			))}
		</section>
	);
}
