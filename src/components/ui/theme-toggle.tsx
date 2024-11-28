"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

export function ThemeToggle(): React.JSX.Element {
	const { setTheme } = useTheme();
	const t = useTranslations("navbar.themeToggle");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">{t("toggle")}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={(): void => setTheme("light")}>
					{t("light")}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={(): void => setTheme("dark")}>
					{t("dark")}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={(): void => setTheme("system")}>
					{t("system")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
