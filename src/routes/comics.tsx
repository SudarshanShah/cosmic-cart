import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { getComics } from "#/functions/comics";

const comicsSearchSchema = z.object({
	sort: z.enum(["title", "price"]).default("title"),
});

export const Route = createFileRoute("/comics")({
	validateSearch: comicsSearchSchema,
	loaderDeps: ({ search }) => ({ sort: search.sort }),
	loader: async ({ deps }) => {
		const comics = await getComics();
		const sorted = [...comics].sort((a, b) =>
			deps.sort === "price"
				? a.price - b.price
				: a.title.localeCompare(b.title),
		);
		return sorted;
	},
	component: ComicsPage,
});

function ComicsPage() {
	const comics = Route.useLoaderData();
	const { sort } = Route.useSearch();

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-extrabold text-purple-400">Comics</h1>
					<p className="mt-2 text-gray-400">Bold stories, bolder art.</p>
				</div>

				<div className="flex gap-2">
					<Link
						to="/comics"
						search={{ sort: "title" }}
						className={`rounded-lg px-3 py-1.5 text-sm transition ${sort === "title" ? "bg-purple-600 text-white" : "bg-gray-900 text-gray-400 hover:text-gray-200"}`}
					>
						Name
					</Link>
					<Link
						to="/comics"
						search={{ sort: "price" }}
						className={`rounded-lg px-3 py-1.5 text-sm transition ${sort === "price" ? "bg-purple-600 text-white" : "bg-gray-900 text-gray-400 hover:text-gray-200"}`}
					>
						Price
					</Link>
				</div>
			</div>

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
