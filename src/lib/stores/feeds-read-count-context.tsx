"use client";
import { createContext, useContext, useState } from "react";

type feedId = number;
/**
 * delta represents the change amount.
 * e.g : +1, -1.
 */
type delta = number;
type FeedsReadCountContextType = {
	/**
	 * Returns the delta change for a given feedId.
	 */
	getDelta: (feedId: feedId) => delta;
	/**
	 *
	 * @param feedId feedId
	 * @param delta represents the change amount.
	 *  e.g : +1, -1.
	 */
	updateDelta: (feedId: feedId, delta: delta) => void;
	/**
	 * Resets the delata for a given feedId to 0.
	 *
	 * @param feedId feedId
	 */
	resetDelta: (feedId: feedId) => void;
};
const FeedsReadCountContext = createContext<FeedsReadCountContextType | null>(
	null,
);

export const useFeedsReadCount = () => {
	const ctx = useContext(FeedsReadCountContext);
	if (!ctx) {
		throw new Error(
			"useFeedsReadCount must be used within a FeedsReadCountProvider",
		);
	}
	return ctx;
};

export default function FeedsReadCountProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [delta, setDelata] = useState<Map<feedId, delta>>(new Map());

	const getDelta = (feedId: feedId) => {
		return delta.get(feedId) ?? 0;
	};

	const updateDelta = (feedId: feedId, delta: number) => {
		setDelata((prev) => {
			const current = prev.get(feedId) ?? 0;
			const next = new Map(prev);
			next.set(feedId, current + delta);
			return next;
		});
	};

	// un/markFeedContentAsRead calls revalidatePath server-side.
	// By the time the client's startTransition callback finishes, Next.js has already pushed the updated RSC payload,
	// meaning userFeedsGroupedByFolderPromise resolves with fresh delta.
	// Calling resetDeltas() at that point ensures the delta doesn't double-subtract from the already-updated server value.
	const resetDelta = (feedId: feedId) => {
		setDelata((prev) => new Map(prev).set(feedId, 0));
	};

	return (
		<FeedsReadCountContext.Provider
			value={{
				getDelta,
				updateDelta,
				resetDelta,
			}}
		>
			{children}
		</FeedsReadCountContext.Provider>
	);
}
