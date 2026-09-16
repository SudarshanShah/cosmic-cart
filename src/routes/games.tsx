import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/games")({ component: GamesPage });

const games = [
	{
		id: "g1",
		title: "Nebula Drift",
		price: 39.99,
		tagline: "A racing game across dying stars.",
	},
	{
		id: "g2",
		title: "Ashen Keep",
		price: 49.99,
		tagline: "A dark-fantasy survival roguelike.",
	},
	{
		id: "g3",
		title: "Pixel Legion",
		price: 24.99,
		tagline: "Retro tactics, modern chaos.",
	},
];

function GamesPage() {
	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<h1 className="text-4xl font-extrabold text-blue-400">Games</h1>
			<p className="mt-2 text-gray-400">Worlds to lose yourself in.</p>

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
