import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { addToServerCart } from "#/functions/cart";
import { getGameById } from "#/functions/games";
import { authClient } from "#/lib/auth-client";
import { cartStore } from "#/stores/cart";

export const Route = createFileRoute("/games_/$gameId")({
	loader: async ({ params }) => {
		try {
			return await getGameById({data: params.gameId})
		} catch {
			throw notFound()
		}
	},
	component: GameDetail,
});

function GameDetail() {
	const game = Route.useLoaderData();
	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();

	async function handleAddToCart() {
		if (session) {
			await addToServerCart({ data: { itemType: "game", itemId: game.id } });
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		} else {
			cartStore.actions.addItem({
				itemId: game.id,
				itemType: "game",
				title: game.title,
				price: game.price,
			});
		}
	}

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-4xl font-extrabold text-blue-300">{game.title}</h1>
				<p className="mt-2 text-lg text-pink-400 font-semibold">
					${game.price.toFixed(2)}
				</p>
				<p className="mt-6 text-gray-300 leading-relaxed">{game.description}</p>
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
