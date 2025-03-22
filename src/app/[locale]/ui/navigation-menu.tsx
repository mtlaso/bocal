"use client";
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
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TbMenu2 } from "react-icons/tb";
import { LogoutForm } from "./auth/logout-form";

export function NavMenu(): React.JSX.Element {
	return (
		<>
			<div className="md:hidden">
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
		<NavigationMenu className="py-5 mb-6 !max-w-full justify-between">
			<NavigationMenuList>
				<NavigationMenuItem>
					<Link href="/dashboard" legacyBehavior passHref>
						<NavigationMenuLink
							className={cn(navigationMenuTriggerStyle(), {
								"font-semibold bg-accent": pathname === "/dashboard",
							})}
						>
							{t("links")}
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<Link href="/archive" legacyBehavior passHref>
						<NavigationMenuLink
							className={cn(navigationMenuTriggerStyle(), {
								"font-semibold bg-accent": pathname === "/archive",
							})}
						>
							{t("archive")}
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<Link href={"/feed"} legacyBehavior passHref>
						<NavigationMenuLink
							className={cn(navigationMenuTriggerStyle(), {
								"font-semibold bg-accent": pathname === "/feed",
							})}
						>
							{t("rssFeed")}
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<Link href="/settings" legacyBehavior passHref>
						<NavigationMenuLink
							className={cn(navigationMenuTriggerStyle(), {
								"font-semibold bg-accent": pathname === "/settings",
							})}
						>
							{t("settings")}
						</NavigationMenuLink>
					</Link>
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

			<SheetContent className="w-full">
				<SheetHeader>
					<SheetTitle className="mb-6 text-left text-4xl leading-tight">
						{t("menu")}
					</SheetTitle>
				</SheetHeader>

				<div className="flex flex-col gap-4">
					<Link
						onClick={(): void => setIsOpen(false)}
						href={"/dashboard"}
						className={cn(
							navigationMenuTriggerStyle(),
							"w-full flex justify-start",
							{
								"font-semibold bg-accent": pathname === "/dashboard",
							},
						)}
					>
						<span>{t("links")}</span>
					</Link>

					<Link
						onClick={(): void => setIsOpen(false)}
						href={"/archive"}
						className={cn(
							navigationMenuTriggerStyle(),
							"w-full flex justify-start",
							{
								"font-semibold bg-accent": pathname === "/archive",
							},
						)}
					>
						<span className="">{t("archive")}</span>
					</Link>

					<Link
						onClick={(): void => setIsOpen(false)}
						href={"/feed"}
						className={cn(
							navigationMenuTriggerStyle(),
							"w-full flex justify-start",
							{
								"font-semibold bg-accent": pathname === "/feed",
							},
						)}
					>
						<span className="">{t("rssFeed")}</span>
					</Link>

					<Link
						onClick={(): void => setIsOpen(false)}
						href={"/settings"}
						className={cn(
							navigationMenuTriggerStyle(),
							"w-full flex justify-start",
							{
								"font-semibold bg-accent": pathname === "/settings",
							},
						)}
					>
						<span className="">{t("settings")}</span>
					</Link>
				</div>

				<SheetFooter className="mt-6 !justify-start flex-row flex-wrap gap-2">
					<ThemeToggle />
					<LocaleToggle />
					<LogoutForm />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
