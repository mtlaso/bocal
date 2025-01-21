"use client";

import { parseURL } from "@/app/[locale]/lib/parse-url";
import { searchParamsParsers } from "@/app/[locale]/lib/stores/search-params";
import { SortOptions } from "@/app/[locale]/lib/types";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useQueryStates } from "nuqs";
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

export function Links({ links, view }: Props): React.JSX.Element {
	const [{ sortLinks, searchedLink }] = useQueryStates(searchParamsParsers);
	const t = useTranslations("dashboard");

	const items = filter(links, sortLinks, searchedLink);

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
				"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4": view === "grid",
				"grid grid-cols-3 grid-rows-2 gap-4": view === "list",
			})}
		>
			{items.map((item) => (
				<Card
					key={item.id}
					className={cn(
						{
							"grid grid-rows-subgrid row-span-3 col-span-1": view === "grid",
							"grid grid-cols-subgrid col-span-3 row-span-2 items-center":
								view === "list",
						},
						"hover:shadow-md dark:hover:shadow-xl transition-all duration-200 break-all",
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
									className={cn("aspect-video h-auto w-full object-cover", {
										"rounded-t-xl": view === "grid",
										"rounded-bl-xl rounded-tl-xl": view === "list",
									})}
									src={item.ogImageURL}
									width={500}
									height={500}
									priority={false}
									alt={t("ogImageAlt")}
								/>
							) : (
								<div
									className={cn(
										`aspect-video h-auto w-full object-cover
										select-none text-9xl text-foreground font-semibold
										bg-gradient-to-br`,
										randomBackground(
											item.ogTitle ?? parseURL(new URL(item.url).host),
										),
										{
											"rounded-t-xl": view === "grid",
											"rounded-bl-xl rounded-tl-xl": view === "list",
										},
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
						className={cn("grid grid-cols2 grid-cols-[90%_1fr] gap-2", {
							"row-start-2 col-start-2 col-span-2 pl-0": view === "list",
						})}
					>
						<Link
							href={item.url}
							target="_blank"
							className=" text-sm text-muted-foreground truncate"
						>
							{parseURL(new URL(item.url).host)}
						</Link>

						<LinksContextMenu id={item.id.toString()} />
					</CardFooter>
				</Card>
			))}
		</section>
	);
}

function filter(
	links: Props["links"],
	sortLinks: SortOptions,
	searchedLink: string,
): Props["links"] {
	let items = [...links];

	// Filter.
	if (searchedLink) {
		items = items.filter((item) => {
			const url = URL.parse(item.url);

			return (
				item.ogTitle
					?.toLowerCase()
					.includes(searchedLink.toLowerCase().trim()) ||
				url?.host?.toLowerCase().includes(searchedLink.toLowerCase().trim())
			);
		});
	}

	// Sort.
	switch (sortLinks) {
		case SortOptions.BY_DATE_ASC:
			items.sort((a, b) => a.id - b.id);
			break;
		case SortOptions.BY_DATE_DESC:
			items.sort((a, b) => b.id - a.id);
			break;
		default:
			break;
	}

	return items;
}
