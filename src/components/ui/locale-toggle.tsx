"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/routing";
import { Languages } from "lucide-react";
import { useParams } from "next/navigation";

export function LocaleToggle(): React.JSX.Element {
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();

	const handleToggleLanguage = (language: string): void => {
		// @ts-expect-error -- TypeScript will validate that only known `params`
		// are used in combination with a given `pathname`. Since the two will
		// always match for the current route, we can skip runtime checks.
		router.replace({ pathname, params }, { locale: language });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Languages className="h-[1.2rem] w-[1.2rem]" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={(): void => handleToggleLanguage("en")}>
					English
				</DropdownMenuItem>
				<DropdownMenuItem onClick={(): void => handleToggleLanguage("fr")}>
					Français
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
