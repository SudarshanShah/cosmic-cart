import { createFileRoute, Link } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { cartStore } from "#/stores/cart";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
	const items = useSelector(cartStore, (items) => items);
	const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
						key={item.id}
						className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4"
					>
						<div>
							<p className="font-semibold">{item.title}</p>
							<p className="text-sm text-gray-400">
								${item.price.toFixed(2)} × {item.quantity}
							</p>
						</div>
						<button
              type="button"
							onClick={() => cartStore.actions.removeItem(item.id)}
							className="text-sm text-red-400 hover:text-red-300 transition"
						>
							Remove
						</button>
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
