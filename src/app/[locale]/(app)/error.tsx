"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

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
