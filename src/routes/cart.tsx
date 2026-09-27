import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { useState } from "react";
import { getServerCart, updateServerCartQuantity } from "#/functions/cart";
import { placeOrder } from "#/functions/orders";
import { authClient } from "#/lib/auth-client";
import { cartStore } from "#/stores/cart";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();
	const localItems = useSelector(cartStore, (items) => items);

	const navigate = useNavigate();
	const [placing, setPlacing] = useState(false);
	const [orderError, setOrderError] = useState("");

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

	async function handlePlaceOrder() {
		setPlacing(true);
		setOrderError("");
		try {
			const result = await placeOrder();
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			navigate({ to: "/orders/$orderId", params: { orderId: result.orderId } });
		} catch (err) {
			setOrderError(
				err instanceof Error ? err.message : "Something went wrong",
			);
			setPlacing(false);
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
					<div className="border-t border-gray-800 pt-4">
						<div className="flex justify-between text-lg font-bold">
							<span>Total</span>
							<span>${total.toFixed(2)}</span>
						</div>

						{orderError && (
							<p className="mt-2 text-sm text-red-400">{orderError}</p>
						)}

						<button
							type="button"
							onClick={handlePlaceOrder}
							disabled={placing || !session}
							className="mt-4 w-full rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-500 transition disabled:opacity-50"
						>
							{placing ? "Placing order..." : "Place Order"}
						</button>

						{!session && (
							<p className="mt-2 text-center text-sm text-gray-400">
								<Link to="/login" className="text-purple-400 hover:underline">
									Log in
								</Link>{" "}
								to check out.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
