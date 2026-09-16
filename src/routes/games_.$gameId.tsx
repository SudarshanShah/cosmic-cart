import { createFileRoute, notFound } from "@tanstack/react-router";

const gamesData = [
	{
		id: "g1",
		title: "Nebula Drift",
		price: 39.99,
		tagline: "A racing game across dying stars.",
		description:
			"Race across collapsing star systems where the track itself is falling apart beneath you. Every lap is a gamble against physics.",
	},
	{
		id: "g2",
		title: "Ashen Keep",
		price: 49.99,
		tagline: "A dark-fantasy survival roguelike.",
		description:
			"The keep remembers every death. Rebuild, fall again, and slowly uncover why the ash never stops falling.",
	},
	{
		id: "g3",
		title: "Pixel Legion",
		price: 24.99,
		tagline: "Retro tactics, modern chaos.",
		description:
			"Command a squad of 16-bit soldiers through a war that keeps rewriting its own rules mid-battle.",
	},
];

export const Route = createFileRoute("/games_/$gameId")({
	loader: async ({ params }) => {
		const game = gamesData.find((g) => g.id === params.gameId);
		if (!game) throw notFound();
		return game;
	},
	component: GameDetail,
});

function GameDetail() {
	const game = Route.useLoaderData();

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-4xl font-extrabold text-blue-300">{game.title}</h1>
				<p className="mt-2 text-lg text-pink-400 font-semibold">
					${game.price.toFixed(2)}
				</p>
				<p className="mt-6 text-gray-300 leading-relaxed">{game.description}</p>
			</div>
		</div>
	);
}
