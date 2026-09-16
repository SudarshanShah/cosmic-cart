import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="min-h-screen bg-gray-950 text-gray-100">
			<div className="mx-auto max-w-5xl px-8 py-24 text-center">
				<h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
					<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
						Cosmic Cart
					</span>
				</h1>
				<p className="mt-4 text-lg text-gray-400">
					Comics, games & toys for people who never grew up.
				</p>

				<div className="mt-10 flex flex-wrap justify-center gap-4">
					<Link
						to="/comics"
						className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-500 transition"
					>
						Browse Comics
					</Link>
				</div>
			</div>
		</div>
	);
}
