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
import { useTranslations } from "next-intl";
import { TbArchive, TbMail, TbRss } from "react-icons/tb";

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
				{elements.map((el) => (
					<BlurFade key={el.index} delay={0.25 + el.index * 0.05}>
						{el.el()}
					</BlurFade>
				))}
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

const HeroSection = (): React.JSX.Element => {
	const t = useTranslations("metadata");
	return (
		<section className={cn("text-center", SPACING.MD)}>
			<h1 className="text-4xl md:text-6xl font-extrabold leading-none tracking-tight">
				{t("headline")}
			</h1>

			<p className="text-xl">{t("description")}</p>

			<div className="flex justify-center">
				<Link href="/login">
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
							"hover:shadow-md transition-all duration-200 bg-transparent",
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
								className={cn("font-extrabold text-xl md:text-2xl", SPACING.SM)}
							>
								<div>
									{feature.key === "0" && (
										<TbArchive className="hover:text-primary" />
									)}
									{feature.key === "1" && (
										<TbRss className="hover:text-primary" />
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
	);
};
