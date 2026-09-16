import { createFileRoute, notFound } from "@tanstack/react-router";
import { getComicById } from "#/functions/comics";
import { cartStore } from "#/stores/cart";

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
					onClick={() =>
						cartStore.actions.addItem({
							id: comic.id,
							title: comic.title,
							price: comic.price,
						})
					}
					className="mt-8 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-500 transition"
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
}
