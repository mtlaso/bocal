"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

/**
 * Renders a 404 error page with a retry option.
 *
 * This component displays an internationalized message indicating an unexpected error,
 * along with a button that triggers the provided reset callback to recover from the error state.
 *
 * @param reset - A callback function that resets the error state.
 * @returns A JSX element representing the full-screen error interface.
 */
export default function Error404({
	reset,
}: {
	reset: () => void;
}): React.JSX.Element {
	const t = useTranslations("errors");

	return (
		<div className="min-h-screen flex flex-col justify-center items-center gap-4">
			<h1 className="text-2xl text-center">{t("unexpected")}</h1>
			<Button onClick={(): void => reset()} type="submit">
				{t("retry")}
			</Button>
		</div>
	);
}
