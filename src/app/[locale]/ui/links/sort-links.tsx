"use client";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { TbArrowsSort } from "react-icons/tb";
import { SortOptions } from "@/app/[locale]/lib/constants";
import { searchParamsState } from "@/app/[locale]/lib/stores/search-params-states";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function SortLinks(): React.JSX.Element {
	return (
		<>
			<div className="md:hidden">
				<SortMobile />
			</div>
			<div className="hidden md:block">
				<SortDesktop />
			</div>
		</>
	);
}

function SortDesktop(): React.JSX.Element {
	const t = useTranslations("navbar");
	const [{ sortLinks }, setSearchParamsState] = useQueryStates(
		searchParamsState.searchParams,
		{
			urlKeys: searchParamsState.urlKeys,
		},
	);

	return (
		<Select
			onValueChange={(e): void => {
				setSearchParamsState({ sortLinks: e as SortOptions });
			}}
			value={sortLinks}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={t("sort.sort")} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={SortOptions.BY_DATE_ASC}>
					{t("sort.byDateAsc")}
				</SelectItem>
				<SelectItem value={SortOptions.BY_DATE_DESC}>
					{t("sort.byDateDesc")}
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

function SortMobile(): React.JSX.Element {
	const t = useTranslations("navbar");
	const [{ sortLinks }, setSearchParamsState] = useQueryStates(
		searchParamsState.searchParams,
		{
			urlKeys: searchParamsState.urlKeys,
		},
	);

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline">
					{t("sort.sort")}
					<TbArrowsSort />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>{t("sort.sort")}</DrawerTitle>
					</DrawerHeader>

					<div className="p-4 pb-0">
						<RadioGroup
							className={`${SPACING.SM}`}
							value={sortLinks}
							onValueChange={(e): void => {
								setSearchParamsState({ sortLinks: e as SortOptions });
							}}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value={SortOptions.BY_DATE_ASC}
									id={t("sort.byDateAsc")}
								/>
								<Label htmlFor={t("sort.byDateAsc")}>
									{t("sort.byDateAsc")}
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value={SortOptions.BY_DATE_DESC}
									id={t("sort.byDateDesc")}
								/>
								<Label htmlFor={t("sort.byDateDesc")}>
									{t("sort.byDateDesc")}
								</Label>
							</div>
						</RadioGroup>
					</div>

					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant="outline">{t("close")}</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
