"use client";

import { sortOptions } from "@/app/[locale]/lib/schema";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
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
			(sort === sortOptions.byDateAsc || sort === sortOptions.byDateDesc)
		) {
			return t(`sort.${sort}`);
		}

		return t("sort.sort");
	};

	return (
		<Select onValueChange={(e): void => handleChange(e)}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={defaultValue()} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={sortOptions.byDateAsc}>
					{t("sort.byDateAsc")}
				</SelectItem>
				<SelectItem value={sortOptions.byDateDesc}>
					{t("sort.byDateDesc")}
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

function SortMobile(): React.JSX.Element {
	// Drawer
	return (
		<Drawer>
			<DrawerTrigger>Open</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Are you absolutely sure?</DrawerTitle>
					<DrawerDescription>This action cannot be undone.</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<Button>Submit</Button>
					<DrawerClose>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
