import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { addToServerCart } from "#/functions/cart";
import { getToyById } from "#/functions/toys";
import { authClient } from "#/lib/auth-client";
import { cartStore } from "#/stores/cart";

export const Route = createFileRoute("/toys_/$toyId")({
	loader: async ({ params }) => {
		try {
			return await getToyById({data: params.toyId})
		} catch {
			throw notFound()
		}
	},
	component: ToyDetail,
});

function ToyDetail() {
	const toy = Route.useLoaderData();
	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();

	async function handleAddToCart() {
		if (session) {
			await addToServerCart({ data: { itemType: "toy", itemId: toy.id } });
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		} else {
			cartStore.actions.addItem({
				itemId: toy.id,
				itemType: "toy",
				title: toy.title,
				price: toy.price,
			});
		}
	}

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-4xl font-extrabold text-orange-300">{toy.title}</h1>
				<p className="mt-2 text-lg text-pink-400 font-semibold">
					${toy.price.toFixed(2)}
				</p>
				<p className="mt-6 text-gray-300 leading-relaxed">{toy.description}</p>
				<button
					type="button"
					onClick={handleAddToCart}
					className="mt-8 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-500 transition"
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
}
