"use client";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TbMenu2 } from "react-icons/tb";
import { APP_ROUTES } from "@/app/[locale]/lib/constants";
import { Button } from "@/components/ui/button";
import { LocaleToggle } from "@/components/ui/locale-toggle";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LogoutForm } from "./auth/logout-form";

export function AppNavigationMenu(): React.JSX.Element {
	return (
		<>
			<div className="md:hidden flex justify-end">
				<MobileNavMenu />
			</div>
			<div className="hidden md:block">
				<DesktopNavMenu />
			</div>
		</>
	);
}

function DesktopNavMenu(): React.JSX.Element {
	const t = useTranslations("navbar");
	const pathname = usePathname();

	return (
		<NavigationMenu className="py-5 mb-6 max-w-full! justify-between">
			<NavigationMenuList>
				<NavigationMenuItem>
					{/* transition-all duration-200 */}
					<NavigationMenuLink
						data-active={pathname === APP_ROUTES.links}
						href={APP_ROUTES.links}
						className={navigationMenuTriggerStyle()}
					>
						{t("links")}
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						data-active={pathname === APP_ROUTES.archive}
						href={APP_ROUTES.archive}
						className={navigationMenuTriggerStyle()}
					>
						{t("archive")}
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						data-active={pathname === APP_ROUTES.feeds}
						href={APP_ROUTES.feeds}
						className={navigationMenuTriggerStyle()}
					>
						{t("rssFeed")}
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						data-active={pathname === APP_ROUTES.newsletters}
						href={APP_ROUTES.newsletters}
						className={navigationMenuTriggerStyle()}
					>
						{t("newsletters")}
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						data-active={pathname === APP_ROUTES.settings}
						href={APP_ROUTES.settings}
						className={navigationMenuTriggerStyle()}
					>
						{t("settings")}
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>

			<span className="flex flex-wrap gap-2">
				<ThemeToggle />
				<LocaleToggle />
				<LogoutForm />
			</span>
		</NavigationMenu>
	);
}

function MobileNavMenu(): React.JSX.Element {
	const t = useTranslations("navbar");
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Sheet open={isOpen} onOpenChange={(status): void => setIsOpen(status)}>
			<SheetTrigger asChild>
				<Button className="py-5 mb-6" variant="outline" size="icon">
					<TbMenu2 />
				</Button>
			</SheetTrigger>

			<SheetContent className="w-full [&>button:first-of-type]:hidden">
				<SheetHeader className="flex-row! justify-between items-start">
					<SheetTitle className="text-2xl leading-tight">
						{t("menu")}
					</SheetTitle>

					<Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
						<XIcon className="size-6" />
						<span className="sr-only">Close</span>
					</Button>
				</SheetHeader>

				<div className="flex flex-col gap-4">
					<Link
						onClick={(): void => setIsOpen(false)}
						href={APP_ROUTES.links}
						className={cn(
							"w-full flex justify-start text-6xl text-muted-foreground hover:cursor-pointer hover:text-secondary-foreground transition-colors duration-200",
							{
								"font-semibold text-secondary-foreground":
									pathname === APP_ROUTES.links,
							},
						)}
					>
						<span>{t("links")}</span>
					</Link>

					<Link
						onClick={(): void => setIsOpen(false)}
						href={APP_ROUTES.archive}
						className={cn(
							"w-full flex justify-start text-6xl text-muted-foreground hover:cursor-pointer hover:text-secondary-foreground transition-colors duration-200",
							{
								"font-semibold text-secondary-foreground":
									pathname === APP_ROUTES.archive,
							},
						)}
					>
						<span>{t("archive")}</span>
					</Link>

					<Link
						onClick={(): void => setIsOpen(false)}
						href={APP_ROUTES.feeds}
						className={cn(
							"w-full flex justify-start text-6xl text-muted-foreground hover:cursor-pointer hover:text-secondary-foreground transition-colors duration-200",
							{
								"font-semibold text-secondary-foreground":
									pathname === APP_ROUTES.feeds,
							},
						)}
					>
						<span>{t("rssFeed")}</span>
					</Link>

					<Link
						onClick={(): void => setIsOpen(false)}
						href={APP_ROUTES.newsletters}
						className={cn(
							"w-full flex justify-start text-6xl text-muted-foreground hover:cursor-pointer hover:text-secondary-foreground transition-colors duration-200",
							{
								"font-semibold text-secondary-foreground":
									pathname === APP_ROUTES.newsletters,
							},
						)}
					>
						<span>{t("newsletters")}</span>
					</Link>

					<Link
						onClick={(): void => setIsOpen(false)}
						href={APP_ROUTES.settings}
						className={cn(
							"w-full flex justify-start text-6xl text-muted-foreground hover:cursor-pointer hover:text-secondary-foreground transition-colors duration-200",
							{
								"font-semibold text-secondary-foreground":
									pathname === APP_ROUTES.settings,
							},
						)}
					>
						<span>{t("settings")}</span>
					</Link>
				</div>

				<SheetFooter className="flex-row flex-wrap gap-2">
					<ThemeToggle />
					<LocaleToggle />
					<LogoutForm />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
