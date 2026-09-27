import { createStore } from "@tanstack/react-store";

export type CartItem = {
	itemType: "comic" | "game" | "toy";
	itemId: string;
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
			const existing = items.find(
				(i) => i.itemType === item.itemType && i.itemId === item.itemId,
			);
			const next = existing
				? items.map((i) =>
						i.itemType === item.itemType && i.itemId === item.itemId
							? { ...i, quantity: i.quantity + 1 }
							: i,
					)
				: [...items, { ...item, quantity: 1 }];
			persist(next);
			return next;
		});
	},
	removeItem: (itemType: CartItem["itemType"], itemId: string) => {
		setState((items) => {
			const next = items.filter(
				(i) => !(i.itemType === itemType && i.itemId === itemId),
			);
			persist(next);
			return next;
		});
	},
	setQuantity: (
		itemType: CartItem["itemType"],
		itemId: string,
		quantity: number,
	) => {
		setState((items) => {
			const next =
				quantity < 1
					? items.filter(
							(i) => !(i.itemType === itemType && i.itemId === itemId),
						)
					: items.map((i) =>
							i.itemType === itemType && i.itemId === itemId
								? { ...i, quantity }
								: i,
						);
			persist(next);
			return next;
		});
	},
	clear: () => {
		setState(() => []);
		persist([]);
	},
}));
