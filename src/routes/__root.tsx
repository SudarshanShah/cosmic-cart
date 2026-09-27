import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useSelector } from "@tanstack/react-store";
import { getServerCart } from "#/functions/cart";
import { authClient } from "#/lib/auth-client";
import { cartStore } from "#/stores/cart";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Cosmic Cart",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: () => (
		<div className="min-h-screen bg-gray-950 flex items-center justify-center p-8 text-gray-100">
			<div className="text-center">
				<h1 className="text-4xl font-extrabold text-pink-400">Nothing here</h1>
				<p className="mt-2 text-gray-400">
					This page doesn't exist, or you don't have access to it.
				</p>
				<Link
					to="/"
					className="mt-6 inline-block text-purple-400 hover:underline"
				>
					← Back to home
				</Link>
			</div>
		</div>
	),
});

function NavBar() {
	const localItemCount = useSelector(cartStore, (items) =>
		items.reduce((sum, i) => sum + i.quantity, 0),
	);
	const { data: session } = authClient.useSession();

	const { data: serverCart } = useQuery({
		queryKey: ["cart"],
		queryFn: () => getServerCart(),
		enabled: !!session, // only fetch when logged in
	});

	const itemCount = session
		? (serverCart?.reduce((sum, i) => sum + i.quantity, 0) ?? 0)
		: localItemCount;

	return (
		<nav className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
			<div className="mx-auto flex max-w-5xl items-center gap-6 px-8 py-4">
				<Link to="/" className="font-extrabold text-lg text-gray-100">
					Cosmic Cart
				</Link>
				<Link
					to="/comics"
					className="text-gray-300 hover:text-purple-400 transition"
					activeProps={{ className: "text-purple-400" }}
				>
					Comics
				</Link>
				<Link
					to="/games"
					className="text-gray-300 hover:text-blue-400 transition"
					activeProps={{ className: "text-blue-400" }}
				>
					Games
				</Link>
				<Link
					to="/toys"
					className="text-gray-300 hover:text-orange-400 transition"
					activeProps={{ className: "text-orange-400" }}
				>
					Toys
				</Link>

				{session ? (
					<button
						type="button"
						onClick={() => authClient.signOut()}
						className="text-gray-300 hover:text-red-400 transition"
					>
						Log Out ({session.user.name})
					</button>
				) : (
					<Link
						to="/login"
						className="text-gray-300 hover:text-pink-400 transition"
					>
						Log In
					</Link>
				)}

				<Link
					to="/cart"
					className="ml-auto rounded-full bg-pink-600 px-3 py-1 text-sm font-semibold hover:bg-pink-500 transition"
					activeProps={{ className: "bg-pink-500" }}
				>
					Cart: {itemCount}
				</Link>
			</div>
		</nav>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				<NavBar />
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
