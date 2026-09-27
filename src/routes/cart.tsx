import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import {
	getServerCart,
	updateServerCartQuantity,
} from "#/functions/cart";
import { authClient } from "#/lib/auth-client";
import { cartStore } from "#/stores/cart";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();
	const localItems = useSelector(cartStore, (items) => items);

	const { data: serverItems } = useQuery({
		queryKey: ["cart"],
		queryFn: () => getServerCart(),
		enabled: !!session,
	});

	const items = session
		? (serverItems ?? []).map((i) => ({
				cartItemId: i.cartItemId,
				itemId: i.itemId,
				itemType: i.itemType,
				title: i.title,
				price: i.price,
				quantity: i.quantity,
			}))
		: localItems.map((i) => ({
				cartItemId: undefined,
				itemId: i.itemId,
				itemType: i.itemType,
				title: i.title,
				price: i.price,
				quantity: i.quantity,
			}));

	const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

	// async function handleRemove(
	// 	itemType: "comic" | "game" | "toy",
	// 	itemId: string,
	// 	cartItemId: string | undefined,
	// ) {
	// 	if (session && cartItemId) {
	// 		await removeFromServerCart({ data: cartItemId });
	// 		queryClient.invalidateQueries({ queryKey: ["cart"] });
	// 	} else {
	// 		cartStore.actions.removeItem(itemType, itemId);
	// 	}
	// }

	async function handleQuantityChange(
		itemType: "comic" | "game" | "toy",
		itemId: string,
		cartItemId: string | undefined,
		newQuantity: number,
	) {
		if (session && cartItemId) {
			await updateServerCartQuantity({
				data: { cartItemId, quantity: newQuantity },
			});
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		} else {
			cartStore.actions.setQuantity(itemType, itemId, newQuantity);
		}
	}

	if (items.length === 0) {
		return (
			<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
				<h1 className="text-4xl font-extrabold text-pink-400">Your Cart</h1>
				<p className="mt-4 text-gray-400">
					It's empty. Go find something cool.
				</p>
				<Link
					to="/comics"
					className="mt-6 inline-block text-purple-400 hover:underline"
				>
					Browse Comics →
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<h1 className="text-4xl font-extrabold text-pink-400">Your Cart</h1>

			<div className="mt-8 max-w-xl space-y-4">
				{items.map((item) => (
					<div
						key={item.itemId}
						className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4"
					>
						<div>
							<p className="font-semibold">{item.title}</p>
							<p className="text-sm text-gray-400">
								${item.price.toFixed(2)} × {item.quantity}
							</p>
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() =>
									handleQuantityChange(
										item.itemType,
										item.itemId,
										item.cartItemId,
										item.quantity - 1,
									)
								}
								className="h-7 w-7 rounded-full border border-gray-700 text-gray-300 hover:border-pink-400 hover:text-pink-400 transition"
							>
								−
							</button>
							<span className="w-6 text-center">{item.quantity}</span>
							<button
								type="button"
								onClick={() =>
									handleQuantityChange(
										item.itemType,
										item.itemId,
										item.cartItemId,
										item.quantity + 1,
									)
								}
								className="h-7 w-7 rounded-full border border-gray-700 text-gray-300 hover:border-pink-400 hover:text-pink-400 transition"
							>
								+
							</button>
						</div>
					</div>
				))}

				<div className="flex justify-between border-t border-gray-800 pt-4 text-lg font-bold">
					<span>Total</span>
					<span>${total.toFixed(2)}</span>
				</div>
			</div>
		</div>
	);
}
