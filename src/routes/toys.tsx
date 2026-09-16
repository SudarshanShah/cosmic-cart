import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/toys")({ component: ToysPage });

const toys = [
	{
		id: "t1",
		title: "Galaxy Blaster",
		price: 19.99,
		tagline: "Foam darts, cosmic style.",
	},
	{
		id: "t2",
		title: "Mecha Buddy",
		price: 34.99,
		tagline: "A collectible transforming robot pal.",
	},
	{
		id: "t3",
		title: "Starlight Plush",
		price: 14.99,
		tagline: "Soft, glowing, impossibly cute.",
	},
];

function ToysPage() {
	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<h1 className="text-4xl font-extrabold text-orange-400">Toys</h1>
			<p className="mt-2 text-gray-400">Cool stuff for shelf and play.</p>

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
