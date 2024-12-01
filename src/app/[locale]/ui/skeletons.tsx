import { Skeleton } from "@/components/ui/skeleton";

export function LinksSkeleton(): React.JSX.Element {
	return (
		<div className="flex items-center space-x-4">
			<Skeleton className="h-[125px] w-[250px] rounded-xl" />
		</div>
	);
}
