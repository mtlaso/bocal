import { SPACING } from "@/app/[locale]/ui/spacing";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function LinksSkeleton(): React.JSX.Element {
	return (
		<div className="flex flex-col space-y-2">
			<Skeleton className="h-[125px] w-[310px] rounded-xl" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-[250px]" />
				<Skeleton className="h-4 w-[200px]" />
			</div>
		</div>
	);
}

export function FeedInfoSkeleton(): React.JSX.Element {
	return (
		<div className="flex flex-col space-y-2">
			<Skeleton className="h-4 w-[250px]" />
			<Skeleton className="h-4 w-[200px]" />
		</div>
	);
}

export function FeedsSkeleton(): React.JSX.Element {
	return (
		<div className="flex items-start justify-start">
			<div
				className="pt-1 pr-2
          flex flex-col justify-between h-full"
			>
				<Skeleton className="rounded-full size-6" />
			</div>

			<div className={cn(SPACING.MD, "grow")}>
				<Skeleton className="h-4 w-[270px]" />
				<div className={SPACING.XS}>
					<Skeleton className="h-4 w-[200px]" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
			</div>
		</div>
	);
}

export function SettingsSkeleton(): React.JSX.Element {
	return (
		<div className={cn("flex flex-col", SPACING.LG)}>
			<section className={cn("mb-12", SPACING.LG)}>
				<Skeleton className="h-4 w-[100px]" />

				<div className={SPACING.MD}>
					<div className={SPACING.SM}>
						<Skeleton className="h-4 w-[100px]" />

						<div className="relative">
							<Skeleton className="h-4 w-full" />
						</div>
					</div>

					<div className={SPACING.SM}>
						<Skeleton className="h-4 w-[250px]" />

						<div className="relative">
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				</div>
			</section>

			<section className={cn("mb-12", SPACING.LG)}>
				<Skeleton className="h-4 w-[250px]" />

				<div className="flex items-center justify-between gap-4 p4">
					<div className={SPACING.XS}>
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[150px]" />
					</div>

					<Skeleton className="h-4 w-[100px]" />
				</div>
			</section>

			<section className={cn("mb-12", SPACING.LG)}>
				<Skeleton className="h-4 w-[250px]" />

				<div className={SPACING.XS}>
					<Skeleton className="h-4 w-[100px]" />
					<Skeleton className="h-4 w-[150px]" />
				</div>
			</section>

			<section className={cn("mb-12", SPACING.LG)}>
				<Skeleton className="h-4 w-[250px]" />

				<div className={SPACING.XS}>
					<Skeleton className="h-4 w-[100px]" />
					<Skeleton className="h-4 w-[150px]" />
				</div>
			</section>
		</div>
	);
}
