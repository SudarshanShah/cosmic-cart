import { createFileRoute, Link } from "@tanstack/react-router";
import { getComics } from "#/functions/comics";

export const Route = createFileRoute("/comics")({
	loader: async () => await getComics(),
	component: ComicsPage,
});

function ComicsPage() {
	const comics = Route.useLoaderData();

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<h1 className="text-4xl font-extrabold text-purple-400">Comics</h1>
			<p className="mt-2 text-gray-400">Bold stories, bolder art.</p>

			<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{comics.map((comic) => (
					<Link
						key={comic.id}
						to="/comics/$comicId"
						params={{ comicId: comic.id }}
						className="rounded-2xl border border-purple-900/50 bg-gray-900 p-5 shadow-sm hover:shadow-lg hover:shadow-purple-900/30 hover:-translate-y-1 transition block"
					>
						<h2 className="text-xl font-bold text-purple-300">{comic.title}</h2>
						<p className="mt-2 text-sm text-gray-400">{comic.tagline}</p>
						<p className="mt-4 font-semibold text-pink-400">
							${comic.price.toFixed(2)}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
