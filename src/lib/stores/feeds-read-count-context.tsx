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
	 * Returns the read count for a given feedId.
	 */
	getReadCount: (feedId: feedId) => delta;
	/**
	 *
	 * @param feedId feedId
	 * @param delta represents the change amount.
	 *  e.g : +1, -1.
	 * @returns
	 */
	updateReadCount: (feedId: feedId, delta: delta) => void;
	/**
	 * Resets the read count for a given feedId to 0.
	 *
	 * @param feedId feedId
	 */
	resetReadCount: (feedId: feedId) => void;
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
	const [readCount, setReadCount] = useState<Map<feedId, delta>>(new Map());

	const getReadCount = (feedId: feedId) => {
		return readCount.get(feedId) ?? 0;
	};

	const updateReadCount = (feedId: feedId, delta: number) => {
		setReadCount((prev) => new Map(prev).set(feedId, delta));
	};

	const resetReadCount = (feedId: feedId) => {
		setReadCount((prev) => new Map(prev).set(feedId, 0));
	};

	return (
		<FeedsReadCountContext.Provider
			value={{ getReadCount, updateReadCount, resetReadCount }}
		>
			{children}
		</FeedsReadCountContext.Provider>
	);
}
