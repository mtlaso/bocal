import { create } from "zustand";
import { persist } from "zustand/middleware";

type SelectedFeedStore = {
	selectedFeed: string;
	setSelectedFeed: (feed: string) => void;
};

export const useSelectedFeedStore = create<SelectedFeedStore>()(
	persist(
		(set, _get) => ({
			selectedFeed: "all",
			setSelectedFeed: (feed: string): void => set({ selectedFeed: feed }),
		}),
		{
			name: "selected-food-storage",
		},
	),
);
