"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { TbSearch } from "react-icons/tb";

export function SearchLinks(): React.JSX.Element {
	return (
		<>
			<div className="md:hidden">
				<SearchMobile />
			</div>
			<div className="hidden md:block">{/* <SearchDesktop /> */}</div>
		</>
	);
}

function SearchMobile(): React.JSX.Element {
	const t = useTranslations("navbar.search-links");
	return (
		<div>
			<Label htmlFor="search-links" className="sr-only">
				{t("search")}
			</Label>

			<div className="relative">
				<Input
					className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
					autoFocus
					id="search-links"
					placeholder={t("search")}
				/>

				<TbSearch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
			</div>
		</div>
		// <Button variant="outline" size="icon">
		// 	<TbSearch />
		// </Button>
	);
}
