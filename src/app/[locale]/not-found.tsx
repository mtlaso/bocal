import { SPACING } from "@/app/[locale]/ui/spacing";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFound(): React.JSX.Element {
	const t = useTranslations("errors.404");

	return (
		<main
			className={cn(
				"min-h-screen flex flex-col justify-center items-center",
				SPACING.MD,
			)}
		>
			<h2 className="text-xl text-center font-semibold">{t("title")}</h2>
			<p className="text-muted-foreground max-w-md">{t("description")}</p>
			<Button asChild>
				<Link href={"/"}>{t("goToHome")}</Link>
			</Button>
		</main>
	);
}
