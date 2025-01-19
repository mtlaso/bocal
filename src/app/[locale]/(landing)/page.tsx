import { SPACING } from "@/app/[locale]/ui/spacing";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TextAnimate } from "@/components/ui/text-animate";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { TbArchive, TbMail, TbRss } from "react-icons/tb";

export default function Home(): React.JSX.Element {
	const t = useTranslations("metadata");

	return (
		<>
			<NavigationMenu className="py-5 mb-6 max-w-6xl px-4 mx-auto justify-between">
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

			<main
				className={cn(
					"min-h-screen max-w-[75ch] mx-auto px-4 overflow-x-hidden mb-12",
					SPACING.LG,
				)}
			>
				{/* hero */}
				<section className={cn("text-center", SPACING.MD)}>
					<TextAnimate
						className="text-4xl md:text-6xl font-extrabold leading-none tracking-tight"
						animation="blurInUp"
						by="line"
						as={"h1"}
						once={true}
					>
						{t("headline")}
					</TextAnimate>

					<TextAnimate
						animation="fadeIn"
						by="line"
						className="text-xl"
						as={"p"}
						once={true}
					>
						{t("description")}
					</TextAnimate>

					<div className="flex justify-center">
						<Link href="/login">
							<ShimmerButton className="shadow-2xl h-12 px-12">
								{t("ctaButton")}
							</ShimmerButton>
						</Link>
					</div>
				</section>

				{/* features */}
				<section
					className={cn(
						"grid grid-cols-1 md:grid-cols-3 grid-rows-1 md:grid-rows-2 gap-6 break-words",
					)}
				>
					{t.raw("features")?.map(
						(feature: {
							key: string;
							title: string;
							description: string;
						}) => (
							<Card
								className={cn(
									"hover:shadow-md transition-all duration-200 gri grid-rows-subgri col-span1 gridcols-subgrid",
									{
										"md:row-start-1 md:col-span-2": feature.key === "0",
										"md:row-start-1 md:row-span-2": feature.key === "1",
										"md:row-start-2 md:col-span-2": feature.key === "2",
									},
								)}
								key={feature.key}
							>
								<CardHeader>
									<CardTitle
										className={cn(
											"font-extrabold text-xl md:text-2xl",
											SPACING.SM,
										)}
									>
										<div>
											{feature.key === "0" && <TbArchive />}
											{feature.key === "1" && <TbRss />}
											{feature.key === "2" && <TbMail />}
										</div>
										<div>{feature.title}</div>
									</CardTitle>
									<CardDescription>{feature.description}</CardDescription>
								</CardHeader>
							</Card>
						),
					)}
				</section>

				{/* cta  */}
				<section className={cn("text-center", SPACING.MD)}>
					<h2 className="text-3xl md:text-4xl font-bold leading-none tracking-tight">
						{t("lastCtaHeadline")}
					</h2>

					<p className="text-lg">{t("lastCtaDescription")}</p>
					<div>
						<Link href="/login">
							<Button size={"lg"}>{t("ctaButton")}</Button>
						</Link>
					</div>
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
