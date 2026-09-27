import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";
import { getGames } from "#/functions/games";

const gamesSearchSchema = z.object({
	sort: z.enum(["title", "price"]).default("title"),
});

export const Route = createFileRoute("/games")({
	validateSearch: gamesSearchSchema,
	loaderDeps: ({ search }) => ({ sort: search.sort }),
	loader: async ({ deps }) => {
		const games = await getGames();
		const sorted = [...games].sort((a, b) =>
			deps.sort === "price"
				? a.price - b.price
				: a.title.localeCompare(b.title),
		);
		return sorted;
	},
	component: GamesPage,
});

function GamesPage() {
	const games = Route.useLoaderData();
	const { sort } = Route.useSearch();

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-extrabold text-blue-400">Games</h1>
					<p className="mt-2 text-gray-400">Worlds to lose yourself in.</p>
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
				{games.map((game) => (
					<Link
						key={game.id}
						to="/games/$gameId"
						params={{ gameId: game.id }}
						className="rounded-2xl border border-blue-900/50 bg-gray-900 p-5 shadow-sm hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-1 transition block"
					>
						<h2 className="text-xl font-bold text-blue-300">{game.title}</h2>
						<p className="mt-2 text-sm text-gray-400">{game.tagline}</p>
						<p className="mt-4 font-semibold text-pink-400">
							${game.price.toFixed(2)}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
