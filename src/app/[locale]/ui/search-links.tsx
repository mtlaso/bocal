"use client";

import { searchParamsParsers } from "@/app/[locale]/lib/stores/search-params";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useRef, useState } from "react";
import { TbSearch, TbX } from "react-icons/tb";

export function SearchLinksDesktop(): React.JSX.Element {
	const [{ searchedLink }, setSearchedLink] =
		useQueryStates(searchParamsParsers);

	const t = useTranslations("navbar.search-links");
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleOpen = (): void => {
		if (open) {
			if (inputRef.current) {
				inputRef.current.blur();
				inputRef.current.value = "";
				setSearchedLink({ searchedLink: "" });
			}

			setOpen(false);
		} else {
			inputRef.current?.focus();
			setOpen(true);
		}
	};

	const handleCloseWithEscape = (
		e: React.KeyboardEvent<HTMLInputElement>,
	): void => {
		if (e.key === "Escape") {
			handleOpen();
		}
	};

	return (
		<div className="hidden md:flex md:gap-2">
			<Button onClick={handleOpen} variant="outline" size="icon">
				{!open && <TbSearch />}
				{open && <TbX />}
			</Button>
			<div
				className={`transition-all duration-200 ease-out
				 ${open ? "w-64 opacity-100" : "w-0 opacity-0"}`}
			>
				<Label htmlFor="search-links" className="sr-only">
					{t("search")}
				</Label>

				<div className="relative">
					<Input
						ref={inputRef}
						className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
						autoFocus={open}
						id="search-links"
						placeholder={t("search")}
						onKeyDown={handleCloseWithEscape}
						defaultValue={searchedLink}
						onChange={(e): Promise<URLSearchParams> =>
							setSearchedLink({ searchedLink: e.currentTarget.value })
						}
					/>

					<TbSearch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
				</div>
			</div>
		</div>
	);
}

export function SearchLinksMobile(): React.JSX.Element {
	const [{ searchedLink }, setSearchedLink] =
		useQueryStates(searchParamsParsers);
	const t = useTranslations("navbar.search-links");
	return (
		<div className="md:hidden">
			<Label htmlFor="search-links" className="sr-only">
				{t("search")}
			</Label>

			<div className="relative">
				<Input
					className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
					id="search-links"
					placeholder={t("search")}
					defaultValue={searchedLink}
					onChange={(e): Promise<URLSearchParams> =>
						setSearchedLink({ searchedLink: e.currentTarget.value })
					}
				/>

				<TbSearch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
			</div>
		</div>
	);
}
