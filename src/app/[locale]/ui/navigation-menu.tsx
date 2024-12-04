"use client";
import { Button } from "@/components/ui/button";
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
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type React from "react";
import { useState } from "react";
import { TbMenu2 } from "react-icons/tb";
import { LogoutForm } from "./auth/logout-form";
import { lusitana } from "./fonts";

export function NavMenu(): React.JSX.Element {
	// const isDesktop = useMediaQuery("(min-width: 768px)");

	// if (isDesktop) {
	// 	return <DesktopNavMenu />;
	// }

	// return <MobileNavMenu />;
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
								"font-semibold bg-primary": pathname === "/dashboard",
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
								"font-semibold bg-primary": pathname === "/archive",
							})}
						>
							{t("archive")}
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
			</NavigationMenuList>

			<span className="self-end">
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
					<SheetTitle
						className={`${lusitana.className} mb-6 text-left text-4xl leading-tight`}
					>
						{t("menu")}
					</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col gap-4">
					<Link
						onClick={(): void => setIsOpen(false)}
						href={"/dashboard"}
						className={cn(
							navigationMenuTriggerStyle(),
							"w-full flex justify-start ",
							{
								"font-semibold bg-primary": pathname === "/dashboard",
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
							"w-full flex justify-start ",
							{
								"font-semibold bg-primary": pathname === "/archive",
							},
						)}
					>
						<span className="">{t("archive")}</span>
					</Link>
				</div>

				<SheetFooter className="mt-6">
					<LogoutForm />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
