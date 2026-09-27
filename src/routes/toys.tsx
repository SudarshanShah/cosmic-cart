import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";
import { getToys } from "#/functions/toys";

const toysSearchSchema = z.object({
	sort: z.enum(["title", "price"]).default("title"),
});

export const Route = createFileRoute("/toys")({
	validateSearch: toysSearchSchema,
	loaderDeps: ({ search }) => ({ sort: search.sort }),
	loader: async ({ deps }) => {
		const toys = await getToys();
		const sorted = [...toys].sort((a, b) =>
			deps.sort === "price"
				? a.price - b.price
				: a.title.localeCompare(b.title),
		);
		return sorted;
	},
	component: ToysPage,
});

function ToysPage() {
	const toys = Route.useLoaderData();
	const { sort } = Route.useSearch();

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-extrabold text-orange-400">Toys</h1>
					<p className="mt-2 text-gray-400">Cool stuff for shelf and play.</p>
				</div>

				<div className="flex gap-2">
					<Link
						to="/games"
						search={{ sort: "title" }}
						className={`rounded-lg px-3 py-1.5 text-sm transition ${sort === "title" ? "bg-purple-600 text-white" : "bg-gray-900 text-gray-400 hover:text-gray-200"}`}
					>
						Name
					</Link>
					<Link
						to="/games"
						search={{ sort: "price" }}
						className={`rounded-lg px-3 py-1.5 text-sm transition ${sort === "price" ? "bg-purple-600 text-white" : "bg-gray-900 text-gray-400 hover:text-gray-200"}`}
					>
						Price
					</Link>
				</div>
			</div>

			<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{toys.map((toy) => (
					<Link
						key={toy.id}
						to="/toys/$toyId"
						params={{ toyId: toy.id }}
						className="rounded-2xl border border-orange-900/50 bg-gray-900 p-5 shadow-sm hover:shadow-lg hover:shadow-orange-900/30 hover:-translate-y-1 transition block"
					>
						<h2 className="text-xl font-bold text-orange-300">{toy.title}</h2>
						<p className="mt-2 text-sm text-gray-400">{toy.tagline}</p>
						<p className="mt-4 font-semibold text-pink-400">
							${toy.price.toFixed(2)}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
