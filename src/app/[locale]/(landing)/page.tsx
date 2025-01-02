"use client";

import { SPACING } from "@/app/[locale]/ui/spacing";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function Home(): React.JSX.Element {
	const t = useTranslations("metadata");

	return (
		<>
			<main
				className={cn(
					"min-h-screen max-w-6xl mx-auto px-4 overflow-x-hidden mb-12",
					SPACING.MD,
				)}
			>
				<NavigationMenu className="py-5 mb-6 !max-w-full justify-between">
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuLink
								href="/"
								className={navigationMenuTriggerStyle()}
							>
								{t("title")}
							</NavigationMenuLink>
							<NavigationMenuLink
								href="/login"
								className={navigationMenuTriggerStyle()}
							>
								{t("login")}
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				{/* hero */}
				<section
					className={cn(
						"min-h-[50dvh] flex flex-col items-center justify-center max-w-prose mx-auto text-center mt10",
						SPACING.MD,
					)}
				>
					<h1 className="text-4xl md:text-6xl font-extrabold leading-none tracking-tight">
						{t("headline")}
					</h1>

					<p className="text-xl">{t("description")}</p>
					<Link href="/login">
						<Button size={"lg"} className="h-12 px-12 text-lg">
							{t("ctaButton")}
						</Button>
					</Link>
				</section>

				{/* features */}
				<section
					className={cn(
						"min-h-[50dvh] max-w-prose mx-auto text-center order rounded-md border-primary p-10",
						SPACING.MD,
					)}
				>
					{t
						.raw("features")
						?.map(
							(feature: {
								key: number;
								title: string;
								description: string;
							}) => (
								<div className={SPACING.SM} key={feature.key}>
									<h1 className="text-xl md:text-2xl font-extrabold leading-none tracking-tight">
										{feature.title}
									</h1>
									<p>{feature.description}</p>
								</div>
							),
						)}
				</section>

				{/* last cta  */}
				<section
					className={cn(
						"flex flex-col items-center justify-center max-w-prose mx-auto text-center",
						SPACING.MD,
					)}
				>
					<h2 className="text-3xl md:text-4xl font-bold leading-none tracking-tight">
						{t("lastCtaHeadline")}
					</h2>
					<p className="text-lg">{t("lastCtaDescription")}</p>
					<Link href="/login">
						<Button size={"lg"}>{t("ctaButton")}</Button>
					</Link>
				</section>
			</main>

			<footer className="bg-secondary p-10">
				<div
					className={cn(
						"flex flex-col items-center justify-center",
						SPACING.SM,
					)}
				>
					<Link href="/legal/privacy">
						<Button size={"sm"} variant={"link"}>
							{t("privacyPolicy.title")}
						</Button>
					</Link>
					<Link href="/legal/terms">
						<Button size={"sm"} variant={"link"}>
							{t("termsOfService.title")}
						</Button>
					</Link>
					<p className="text-sm">{t("footerShortDescription")}</p>
					<p className="text-xs">&copy; 2024 Bocal.</p>
				</div>
			</footer>
		</>
	);
}
