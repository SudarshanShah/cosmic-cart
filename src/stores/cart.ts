import { createStore } from "@tanstack/react-store";

export type CartItem = {
	id: string;
	title: string;
	price: number;
	quantity: number;
};

const STORAGE_KEY = "cosmic-cart-items";

function loadInitialCart(): CartItem[] {
	if (typeof window === "undefined") return []; // SSR guard — no localStorage on the server
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function persist(items: CartItem[]) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const cartStore = createStore(loadInitialCart(), ({ setState }) => ({
	addItem: (item: Omit<CartItem, "quantity">) => {
		setState((items) => {
			const existing = items.find((i) => i.id === item.id);
			const updatedItems = existing
				? items.map((i) =>
						i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
					)
				: [...items, { ...item, quantity: 1 }];
			persist(updatedItems);
			return updatedItems;
		});
	},
	removeItem: (id: string) => {
		setState((items) => {
			const updatedItems = items.filter((i) => i.id !== id);
			persist(updatedItems);
			return updatedItems;
		});
	},
}));
