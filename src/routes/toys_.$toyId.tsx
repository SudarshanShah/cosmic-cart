import { createFileRoute, notFound } from "@tanstack/react-router";

const toysData = [
	{
		id: "t1",
		title: "Galaxy Blaster",
		price: 19.99,
		tagline: "Foam darts, cosmic style.",
		description:
			"A hand-cranked blaster with glow-in-the-dark darts and a satisfying thunk. Ages 6+.",
	},
	{
		id: "t2",
		title: "Mecha Buddy",
		price: 34.99,
		tagline: "A collectible transforming robot pal.",
		description:
			"Twelve points of articulation and a transform sequence that takes way longer than it should — in a good way.",
	},
	{
		id: "t3",
		title: "Starlight Plush",
		price: 14.99,
		tagline: "Soft, glowing, impossibly cute.",
		description:
			"A plush star with a soft internal LED that pulses gently. Battery included, hugs guaranteed.",
	},
];

export const Route = createFileRoute("/toys_/$toyId")({
	loader: async ({ params }) => {
		const toy = toysData.find((t) => t.id === params.toyId);
		if (!toy) throw notFound();
		return toy;
	},
	component: ToyDetail,
});

function ToyDetail() {
	const toy = Route.useLoaderData();

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-4xl font-extrabold text-orange-300">{toy.title}</h1>
				<p className="mt-2 text-lg text-pink-400 font-semibold">
					${toy.price.toFixed(2)}
				</p>
				<p className="mt-6 text-gray-300 leading-relaxed">{toy.description}</p>
			</div>
		</div>
	);
}
