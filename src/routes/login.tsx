import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { mergeGuestCart } from "#/functions/cart";
import { authClient } from "#/lib/auth-client";
import { cartStore } from "#/stores/cart";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	async function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
		setError("");

		const { error } = await authClient.signIn.email({ email, password });

		if (error) {
			setError(error.message ?? "Invalid credentials");
			return;
		}

		const guestItems = cartStore.state.map((item) => ({
			itemType: item.itemType,
			itemId: item.itemId,
			quantity: item.quantity,
		}));
		if (guestItems.length > 0) {
			await mergeGuestCart({ data: guestItems });
			cartStore.actions.clear();
		}

		navigate({ to: "/" });
	}

	return (
		<div className="min-h-screen bg-gray-950 p-8 text-gray-100">
			<div className="mx-auto max-w-sm">
				<h1 className="text-3xl font-extrabold text-pink-400">Log In</h1>

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2"
						required
					/>
					{error && <p className="text-sm text-red-400">{error}</p>}
					<button
						type="submit"
						className="w-full rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-500 transition"
					>
						Log In
					</button>
				</form>

				<p className="mt-4 text-sm text-gray-400">
					No account?{" "}
					<Link to="/signup" className="text-purple-400 hover:underline">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
