import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useSelector } from "@tanstack/react-store";
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
				title: "TanStack Start Starter",
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
});

function NavBar() {
	const itemCount = useSelector(cartStore, (items) =>
		items.reduce((sum, i) => sum + i.quantity, 0),
	);

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
				<span className="ml-auto rounded-full bg-pink-600 px-3 py-1 text-sm font-semibold">
					<Link
						to="/cart"
						className="ml-auto rounded-full bg-pink-600 px-3 py-1 text-sm font-semibold hover:bg-pink-500 transition"
						activeProps={{ className: "bg-pink-500" }}
					>
						Cart: {itemCount}
					</Link>
				</span>
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
