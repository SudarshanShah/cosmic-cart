import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Spinner } from "#/components/Spinner";
import type { getServerCart } from "#/functions/cart";
import { addToServerCart } from "#/functions/cart";
import { getToyById } from "#/functions/toys";
import { authClient } from "#/lib/auth-client";
import { cartStore } from "#/stores/cart";

type ServerCartItem = Awaited<ReturnType<typeof getServerCart>>[number];

export const Route = createFileRoute("/toys_/$toyId")({
	loader: async ({ params }) => {
		try {
			return await getToyById({ data: params.toyId });
		} catch {
			throw notFound();
		}
	},
	component: ToyDetail,
});

function ToyDetail() {
	const toy = Route.useLoaderData();
	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();

	const addToCart = useMutation({
		mutationFn: () =>
			addToServerCart({ data: { itemType: "toy", itemId: toy.id } }),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["cart"] });
			const previousCart = queryClient.getQueryData<ServerCartItem[]>(["cart"]);

			queryClient.setQueryData<ServerCartItem[]>(["cart"], (old = []) => {
				const existing = old.find(
					(i) => i.itemType === "toy" && i.itemId === toy.id,
				);
				if (existing) {
					return old.map((i) =>
						i === existing ? { ...i, quantity: i.quantity + 1 } : i,
					);
				}
				return [
					...old,
					{
						cartItemId: `optimistic-${toy.id}`,
						itemType: "toy" as const,
						itemId: toy.id,
						title: toy.title,
						price: toy.price,
						quantity: 1,
					},
				];
			});

			return { previousCart };
		},
		onError: (_err, _vars, context) => {
			queryClient.setQueryData(["cart"], context?.previousCart);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	async function handleAddToCart() {
		if (session) {
			addToCart.mutate();
		} else {
			cartStore.actions.addItem({
				itemType: "toy",
				itemId: toy.id,
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
					disabled={addToCart.isPending}
					className="mt-8 flex w-40 items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-500 transition disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
				>
					{addToCart.isPending ? (
						<Spinner className="h-4 w-4" />
					) : (
						"Add to Cart"
					)}
				</button>
			</div>
		</div>
	);
}
