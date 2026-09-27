import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Spinner } from "#/components/Spinner";
import type { getServerCart } from "#/functions/cart";
import { addToServerCart } from "#/functions/cart";
import { getComicById } from "#/functions/comics";
import { authClient } from "#/lib/auth-client";
import { cartStore } from "#/stores/cart";

/** 
 ReturnType<typeof getServerCart> — "give me the type that getServerCart returns." Since getServerCart is async, it actually returns a Promise<...>, not the array directly.

Awaited<...> — "unwrap the Promise, give me what it resolves to." 

So Awaited<ReturnType<typeof getServerCart>> is the actual array type, and [number] on the end means "give me the type of one element of that array" (indexing a type by number is TypeScript's way of saying "the array's item type," same trick as type Item = MyArray[number]).
*/
type ServerCartItem = Awaited<ReturnType<typeof getServerCart>>[number];

export const Route = createFileRoute("/comics_/$comicId")({
	// the loader is a function that runs before the component is rendered
	// it is used to fetch the data for the component
	// it is a good place to fetch data from the server
	// it is a good place to validate the data
	// it is a good place to redirect the user if the data is not found
	// it is a good place to set the title of the page
	// it is a good place to set the meta tags for the page
	// it is a good place to set the canonical URL for the page
	loader: async ({ params }) => {
		try {
			return await getComicById({ data: params.comicId });
		} catch {
			throw notFound();
		}
	},
	component: ComicDetail,
});

function ComicDetail() {
	const comic = Route.useLoaderData();
	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();

	const addToCart = useMutation({
		mutationFn: () =>
			addToServerCart({ data: { itemType: "comic", itemId: comic.id } }),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["cart"] });
			const previousCart = queryClient.getQueryData<ServerCartItem[]>(["cart"]);

			queryClient.setQueryData<ServerCartItem[]>(["cart"], (old = []) => {
				const existing = old.find(
					(i) => i.itemType === "comic" && i.itemId === comic.id,
				);
				if (existing) {
					return old.map((i) =>
						i === existing ? { ...i, quantity: i.quantity + 1 } : i,
					);
				}
				return [
					...old,
					{
						cartItemId: `optimistic-${comic.id}`,
						itemType: "comic" as const,
						itemId: comic.id,
						title: comic.title,
						price: comic.price,
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
		// if (session) {
		// 	await addToServerCart({ data: { itemType: "comic", itemId: comic.id } });
		// 	queryClient.invalidateQueries({ queryKey: ["cart"] });
		// } else {
		// 	cartStore.actions.addItem({
		// 		itemId: comic.id,
		// 		itemType: "comic",
		// 		title: comic.title,
		// 		price: comic.price,
		// 	});
		// }
		if (session) {
			addToCart.mutate();
		} else {
			cartStore.actions.addItem({
				itemType: "comic",
				itemId: comic.id,
				title: comic.title,
				price: comic.price,
			});
		}
	}

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-4xl font-extrabold text-purple-300">
					{comic.title}
				</h1>
				<p className="mt-2 text-lg text-pink-400 font-semibold">
					${comic.price.toFixed(2)}
				</p>
				<p className="mt-6 text-gray-300 leading-relaxed">
					{comic.description}
				</p>

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
