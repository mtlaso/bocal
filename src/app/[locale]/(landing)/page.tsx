import { useTranslations } from "next-intl";
import { TbArchive, TbMail, TbRss } from "react-icons/tb";
import { APP_ROUTES } from "@/app/[locale]/lib/constants";
import { ScrollIndicator } from "@/app/[locale]/ui/landing/scroll-indicator";
import { SPACING } from "@/app/[locale]/ui/spacing";
import BlurFade from "@/components/ui/blur-fade";
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
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export default function Home(): React.JSX.Element {
	const t = useTranslations("metadata");
	const elements: {
		el: () => React.JSX.Element;
		index: number;
	}[] = [
		{
			el: HeroSection,
			index: 0,
		},
		{
			el: FeaturesSection,
			index: 1,
		},
		{
			el: CtaSection,
			index: 2,
		},
	];

	return (
		<>
			<main className="min-h-screen px-4 overflow-x-hidden mb-12">
				<NavigationMenu className="px-4 h-[10dvh] flex justif-around">
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuLink
								href="/"
								className={cn(
									navigationMenuTriggerStyle(),
									"font-bold text-2xl",
								)}
							>
								{t("title")}
							</NavigationMenuLink>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuLink
								href={APP_ROUTES.login}
								className={navigationMenuTriggerStyle()}
							>
								{t("login")}
							</NavigationMenuLink>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuLink
								href="#features"
								className={navigationMenuTriggerStyle()}
							>
								{t("features-text")}
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				{elements.map((el) => (
					<BlurFade key={el.index} delay={0.25 + el.index * 0.05}>
						{el.el()}
					</BlurFade>
				))}

				<ScrollIndicator />
			</main>

			<footer
				className={cn(
					"flex flex-col items-center justify-center bg-secondary p-10",
					SPACING.SM,
				)}
			>
				<Link href={APP_ROUTES.legalPrivacy}>
					<Button size={"sm"} variant={"link"}>
						{t("privacyPolicy.title")}
					</Button>
				</Link>

				<Link href={APP_ROUTES.legalTerms}>
					<Button size={"sm"} variant={"link"}>
						{t("termsOfService.title")}
					</Button>
				</Link>
				<p className="text-sm text-center">{t("footerShortDescription")}</p>
				<p className="text-xs">&copy; {new Date().getFullYear()} Bocal.</p>
			</footer>
		</>
	);
}

const HeroSection = (): React.JSX.Element => {
	const t = useTranslations("metadata");
	return (
		<section
			className={cn(
				"max-w-[75ch] mx-auto text-center h-[90dvh] flex flex-col justify-center items-center",
				SPACING.LG,
			)}
		>
			<h1 className="text-4xl md:text-6xl font-extrabold leading-none tracking-tight">
				{t("headline")}
			</h1>

			<p className="text-xl">{t("description")}</p>

			<div className="flex justify-center">
				<Link href={APP_ROUTES.login}>
					<ShimmerButton className="shadow-2xl dark:shadow-none h-12 px-12">
						<span className="dark:text-white">{t("ctaButton")}</span>
					</ShimmerButton>
				</Link>
			</div>
		</section>
	);
};

const FeaturesSection = (): React.JSX.Element => {
	const t = useTranslations("metadata");

	return (
		<section
			id="features"
			className={cn(
				"max-w-[75ch] mx-auto scroll-m-32 grid grid-cols-1 md:grid-cols-3 grid-rows1 md:grid-rows-2 gap-6",
			)}
		>
			{t
				.raw("features")
				?.map(
					(feature: { key: string; title: string; description: string }) => (
						<Card
							className={cn(
								"hover:shadow-md transition-all duration-200 break-words",
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
										"font-extrabold text-xl md:text-2xl font-old",
										SPACING.SM,
									)}
								>
									<div>
										{feature.key === "0" && (
											<TbArchive className="hover:text-primary transition-all duration-200" />
										)}
										{feature.key === "1" && (
											<TbRss className="hover:text-primary transition-all duration-200" />
										)}
										{feature.key === "2" && (
											<TbMail className="hover:text-primary transition-all duration-200" />
										)}
									</div>
									<div>{feature.title}</div>
								</CardTitle>
								<CardDescription>{feature.description}</CardDescription>
							</CardHeader>
						</Card>
					),
				)}
		</section>
	);
};

const CtaSection = (): React.JSX.Element => {
	const t = useTranslations("metadata");
	return (
		<section
			className={cn(
				"max-w-[75ch] h-[50dvh] mx-auto flex flex-col justify-center items-center text-center",
				SPACING.LG,
			)}
		>
			<h2 className="text-3xl md:text-4xl font-bold leading-none tracking-tight">
				{t("lastCtaHeadline")}
			</h2>

			<p className="text-lg">{t("lastCtaDescription")}</p>
			<div>
				<Link href={APP_ROUTES.login}>
					<Button size={"lg"}>{t("ctaButton")}</Button>
				</Link>
			</div>
		</section>
	);
};
