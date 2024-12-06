"use client";

import { sortOptions } from "@/app/[locale]/lib/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { TbArrowDown } from "react-icons/tb";

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
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();

	const handleChange = (value: string): void => {
		const params = new URLSearchParams(searchParams);
		params.set("sort", value);

		replace(`${pathname}?${params.toString()}`);
	};

	const defaultValue = (): string => {
		const sort = searchParams.get("sort")?.toString();

		if (
			sort !== undefined &&
			(sort === sortOptions["by-date-asc"] ||
				sort === sortOptions["by-date-desc"])
		) {
			return sort;
		}

		return t("sort.sort");
	};

	return (
		<Select onValueChange={(e): void => handleChange(e)}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={defaultValue()} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="by-date-asc">{t("sort.byDateAsc")}</SelectItem>
				<SelectItem value="by-date-desc">{t("sort.byDateDesc")}</SelectItem>
			</SelectContent>
		</Select>
	);
}

function SortMobile(): React.JSX.Element {
	// Drawer
	return (
		<div>
			<TbArrowDown />
		</div>
	);
}
