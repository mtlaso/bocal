import { sortOptions } from "@/app/[locale]/lib/types";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

type SortLogicReturnType = {
	handleChange: (value: string) => void;
	value: () => string;
};

export function useSortLogic(): SortLogicReturnType {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();

	const handleChange = (value: string): void => {
		const params = new URLSearchParams(searchParams);
		params.set("sort", value);

		replace(`${pathname}?${params.toString()}`);
	};

	const value = (): string => {
		const sort = searchParams.get("sort")?.toString();

		// If sort param is undefined, return an empty string
		if (sort === undefined) return "";

		if (sort === sortOptions.byDateDesc) return sortOptions.byDateDesc;
		if (sort === sortOptions.byDateAsc) return sortOptions.byDateAsc;

		// If sort param is not a valid value, return an empty string
		return "";
	};

	return { handleChange, value };
}
