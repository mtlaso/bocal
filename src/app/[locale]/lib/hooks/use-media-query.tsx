import { useEffect, useState } from "react";

// ex: useMediaQuery("(min-width: 768px)")
export function useMediaQuery(query: string): boolean {
	const [value, setValue] = useState(false);

	useEffect(() => {
		function onChange(event: MediaQueryListEvent): void {
			setValue(event.matches);
		}

		const result = matchMedia(query);
		result.addEventListener("change", onChange);
		setValue(result.matches);

		return (): void => result.removeEventListener("change", onChange);
	}, [query]);

	return value;
}
