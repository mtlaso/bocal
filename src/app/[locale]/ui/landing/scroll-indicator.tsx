"use client";
import { ArrowDownUp } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function ScrollIndicator(): React.JSX.Element {
	const [isVisible, setIsVisible] = useState(true);
	const isMobile = useIsMobile();

	useEffect(() => {
		const scrollListener = (): void => {
			if (window.scrollY > 100) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}
		};
		window.addEventListener("scroll", scrollListener);
		return (): void => window.removeEventListener("scroll", scrollListener);
	}, []);

	return (
		<Activity mode={isMobile ? "hidden" : "visible"}>
			<ArrowDownUp
				className={cn(
					"size-6 z-10 fixed right-12 bottom-12 transition-all duration-400 ease-out",
					{
						"opacity-0": !isVisible,
						"opacity-100": isVisible,
					},
				)}
			/>
		</Activity>
	);
}
