"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import { parsing } from "@/app/[locale]/lib/parsing";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
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
import { LinksContextMenu } from "./links-context-menu";

type Props = {
	links: {
		id: number;
		url: string;
		ogTitle: string | null;
		ogImageURL: string | null;
	}[];
};

export function Links({ links }: Props): React.JSX.Element {
	const [{ sortLinks, searchedLink }] = useQueryStates(
		searchParamsState.searchParams,
		{
			urlKeys: searchParamsState.urlKeys,
		},
	);
	const t = useTranslations("dashboard");
	const [items, setItems] = useState<typeof links>(
		filter(links, sortLinks, searchedLink),
	);

	useEffect(() => {
		setItems(filter(links, sortLinks, searchedLink));
	}, [links, sortLinks, searchedLink]);

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

	// Optimistic delete.
	const handleOnDelete = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id.toString() !== id));
	};

	// Optimistic delete.
	// If the deletion fails, add the last deleted item back to the list.
	const handleOnDeleteFailed = (id: string) => {
		const lastDeletedItem = items.find((item) => item.id.toString() === id);
		if (lastDeletedItem) {
			setItems((prev) =>
				filter([...prev, lastDeletedItem], sortLinks, searchedLink),
			);
		}
	};

	return (
		<section className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}>
			<AnimatePresence>
				{items.map((item, idx) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, animationDelay: idx * 1000 }}
						exit={{ opacity: 0 }}
						className="grid grid-rows-subgrid row-span-3 col-span-1"
					>
						<Card className="pt-0 pl-0 hover:shadow-md transition-all duration-200 wrap-anywhere">
							<CardHeader className={"p-0"}>
								<Link href={item.url} target="_blank">
									{item.ogImageURL && (
										<Image
											className={
												"aspect-video w-full object-center rounded-t-xl"
											}
											src={item.ogImageURL}
											width={500}
											height={500}
											priority={true}
											alt={t("ogImageAlt")}
										/>
									)}

									{!item.ogImageURL && (
										<div
											className={cn(
												"aspect-video bg-linear-to-br rounded-t-xl",
												randomBackground(
													item.ogTitle ??
														parsing.readableUrl(new URL(item.url).host),
												),
											)}
										/>
									)}
								</Link>
							</CardHeader>

							<CardContent>
								<CardTitle>
									<Link
										href={item.url}
										target="_blank"
										className="line-clamp-3"
									>
										{item.ogTitle ?? new URL(item.url).host}
									</Link>
								</CardTitle>
							</CardContent>

							<CardFooter className="flex justify-between">
								<Link
									href={item.url}
									target="_blank"
									className=" text-sm text-muted-foreground truncate"
								>
									{parsing.readableUrl(new URL(item.url).host)}
								</Link>

								<LinksContextMenu
									onDelete={(id) => handleOnDelete(id)}
									onDeleteFailed={(id) => handleOnDeleteFailed(id)}
									onArchive={(id) => handleOnDelete(id)}
									onArchiveFailed={(id) => handleOnDeleteFailed(id)}
									id={item.id.toString()}
								/>
							</CardFooter>
						</Card>
					</motion.div>
				))}
			</AnimatePresence>
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
