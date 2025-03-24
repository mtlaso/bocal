"use client";
import { useMediaQuery } from "@/app/[locale]/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ArrowDownUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollIndicator(): React.JSX.Element {
	const [isVisible, setIsVisible] = useState(true);
	const smallScreen = useMediaQuery("(max-width: 768px)");

	useEffect(() => {
		window.addEventListener("scroll", scrollListener);
		return (): void => window.removeEventListener("scroll", scrollListener);
	}, []);

	const scrollListener = (): void => {
		if (window.scrollY > 100) {
			setIsVisible(false);
		} else {
			setIsVisible(true);
		}
	};
	return (
		<>
			<ArrowDownUp
				className={cn(
					"size-6 z-10 fixed right-12 bottom-12  transition-all duration-400 ease-out",
					{
						"opacity-0": !isVisible,
						"opacity-100": isVisible,
						"scale-0": smallScreen,
					},
				)}
			/>
		</>
	);
}
