"use client"

import { useTranslations } from "next-intl"
import { useQueryStates } from "nuqs"
import { useRef, useState } from "react"
import { TbSearch, TbX } from "react-icons/tb"
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SearchLinksDesktop(): React.JSX.Element {
	const [{ searchedLink }, setSearchParamsState] = useQueryStates(searchParamsState.searchParams, {
		urlKeys: searchParamsState.urlKeys,
	})

	const t = useTranslations("navbar.search-links")
	const [isOpen, setIsOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleOpen = (): void => {
		inputRef.current?.focus()
		setIsOpen(true)
	}

	const handleClose = (): void => {
		setIsOpen(false)
		inputRef.current?.blur()
		setSearchParamsState({ searchedLink: "" })
		if (inputRef.current?.value) {
			inputRef.current.value = ""
		}
	}

	const handleCloseWithEscape = (e: React.KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === "Escape") {
			handleClose()
		}
	}

	return (
		<div className="hidden md:flex md:gap-2">
			<Button onClick={isOpen ? handleClose : handleOpen} variant="outline" size="icon">
				{!isOpen && <TbSearch />}
				{isOpen && <TbX />}
			</Button>
			<div
				className={`transition-all duration-200 ease-out
				 ${isOpen ? "w-64 opacity-100 pointer-events-auto" : "w-0 opacity-0 pointer-events-none"}`}
			>
				<Label htmlFor="search-links-desktop" className="sr-only">
					{t("search")}
				</Label>

				<div className="relative">
					<Input
						id="search-links-desktop"
						ref={inputRef}
						className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
						autoFocus={isOpen}
						placeholder={t("search")}
						onKeyDown={handleCloseWithEscape}
						value={searchedLink}
						onChange={(e): Promise<URLSearchParams> =>
							setSearchParamsState({ searchedLink: e.currentTarget.value })
						}
					/>

					<TbSearch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

					<button
						type="button"
						onClick={(): Promise<URLSearchParams> | undefined => {
							if (inputRef.current?.value?.length) return setSearchParamsState({ searchedLink: "" })
							handleClose()
						}}
						className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"
					>
						<TbX />
					</button>
				</div>
			</div>
		</div>
	)
}

export function SearchLinksMobile(): React.JSX.Element {
	const [{ searchedLink }, setSearchParamsState] = useQueryStates(searchParamsState.searchParams, {
		urlKeys: searchParamsState.urlKeys,
	})
	const t = useTranslations("navbar.search-links")
	return (
		<div className="md:hidden">
			<Label htmlFor="search-links-mobile" className="sr-only">
				{t("search")}
			</Label>

			<div className="relative">
				<Input
					className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
					id="search-links-mobile"
					placeholder={t("search")}
					value={searchedLink}
					onChange={(e): Promise<URLSearchParams> =>
						setSearchParamsState({ searchedLink: e.currentTarget.value })
					}
				/>

				<TbSearch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

				<button
					type="button"
					onClick={(_e): Promise<URLSearchParams> => setSearchParamsState({ searchedLink: "" })}
					className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"
				>
					<TbX />
				</button>
			</div>
		</div>
	)
}
