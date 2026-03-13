"use client";

import { createContext, useContext, useState } from "react";

type feedId = number;
type FeedsUnreadCountContextType = {
	getUnreadCount: (feedId: number, serverUnread: number) => number;
	setOptimisticUnread: (
		feedId: number,
		optimistic: number,
		baseline: number,
	) => void;
	clearOptimistic: (feedId: number) => void;
};
const FeedsReadCountContext = createContext<FeedsUnreadCountContextType | null>(
	null,
);

export const useFeedsUnereadCount = () => {
	const ctx = useContext(FeedsReadCountContext);
	if (!ctx) {
		throw new Error(
			"useFeedsReadCount must be used within a FeedsReadCountProvider",
		);
	}
	return ctx;
};

export default function FeedsUnreadCountProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [optimistic, setOptimistic] = useState<
		Map<feedId, { optimistic: number; baseline: number }>
	>(new Map());

	const getUnreadCount = (feedId: feedId, serverUnreadCount: number) => {
		const entry = optimistic.get(feedId);
		if (!entry) return serverUnreadCount;
		// server has caught up -> ignore optimistic automatically.
		if (serverUnreadCount !== entry.baseline) return serverUnreadCount;
		return entry.optimistic;
	};

	const setOptimisticUnread = (
		feedId: number,
		optimistic: number,
		baseline: number,
	) => {
		setOptimistic((prev) =>
			new Map(prev).set(feedId, { optimistic, baseline }),
		);
	};

	const clearOptimistic = (feedId: number) =>
		setOptimistic((prev) => {
			const next = new Map(prev);
			next.delete(feedId);
			return next;
		});

	return (
		<FeedsReadCountContext.Provider
			value={{
				getUnreadCount,
				setOptimisticUnread,
				clearOptimistic,
			}}
		>
			{children}
		</FeedsReadCountContext.Provider>
	);
}
