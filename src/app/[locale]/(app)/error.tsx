"use client"; // Error boundaries must be Client Components

import { logger } from "@/app/[locale]/lib/logging";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error404({
	err,
	reset,
}: {
	err: Error & { digest?: string };
	reset: () => void;
}): React.JSX.Element {
	const t = useTranslations("errors");

	useEffect(() => {
		logger.error(err);
	}, [err]);

	return (
		<div className="min-h-screen flex flex-col justify-center items-center gap-4">
			<h1 className="text-2xl text-center">{t("unexpected")}</h1>
			<Button
				onClick={(): void =>
					// Réessayer de re-render
					reset()
				}
				type="submit"
			>
				{t("retry")}
				{JSON.stringify(err)}
			</Button>
		</div>
	);
}
