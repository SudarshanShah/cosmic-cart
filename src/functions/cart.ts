import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "#/db/client";
import { cartItems, comics, games, toys } from "#/db/schema";
import { requireAuth } from "#/lib/get-session";

const tableFor = { comic: comics, game: games, toy: toys } as const;
type ItemType = keyof typeof tableFor;

export const getServerCart = createServerFn().handler(async () => {
	const session = await requireAuth();

	const rows = await db
		.select()
		.from(cartItems)
		.where(eq(cartItems.userId, session.user.id));

	// Enrich each cart row with its product details from the right table
	const enriched = await Promise.all(
		rows.map(async (row) => {
			const table = tableFor[row.itemType as ItemType];
			const [product] = await db
				.select()
				.from(table)
				.where(eq(table.id, row.itemId));
			return {
				cartItemId: row.id,
				itemType: row.itemType,
				itemId: row.itemId,
				quantity: row.quantity,
				title: product?.title ?? "Unknown item",
				price: product?.price ?? 0,
			};
		}),
	);

	return enriched;
});

export const addToServerCart = createServerFn({ method: "POST" })
	.validator((input: { itemType: ItemType; itemId: string }) => input)
	.handler(async ({ data }) => {
		const session = await requireAuth();

		const [existing] = await db
			.select()
			.from(cartItems)
			.where(
				and(
					eq(cartItems.userId, session.user.id),
					eq(cartItems.itemType, data.itemType),
					eq(cartItems.itemId, data.itemId),
				),
			);

		if (existing) {
			await db
				.update(cartItems)
				.set({ quantity: existing.quantity + 1 })
				.where(eq(cartItems.id, existing.id));
		} else {
			await db.insert(cartItems).values({
				id: crypto.randomUUID(),
				userId: session.user.id,
				itemType: data.itemType,
				itemId: data.itemId,
				quantity: 1,
			});
		}
	});

export const removeFromServerCart = createServerFn({ method: "POST" })
	.validator((cartItemId: string) => cartItemId)
	.handler(async ({ data: cartItemId }) => {
		const session = await requireAuth();
		await db
			.delete(cartItems)
			.where(
				and(
					eq(cartItems.id, cartItemId),
					eq(cartItems.userId, session.user.id),
				),
			);
	});

export const updateServerCartQuantity = createServerFn({ method: "POST" })
	.validator((input: { cartItemId: string; quantity: number }) => input)
	.handler(async ({ data }) => {
		const session = await requireAuth();

		if (data.quantity < 1) {
			await db
				.delete(cartItems)
				.where(
					and(
						eq(cartItems.id, data.cartItemId),
						eq(cartItems.userId, session.user.id),
					),
				);
			return;
		}

		await db
			.update(cartItems)
			.set({ quantity: data.quantity })
			.where(
				and(
					eq(cartItems.id, data.cartItemId),
					eq(cartItems.userId, session.user.id),
				),
			);
	});

export const mergeGuestCart = createServerFn({ method: "POST" })
	.validator(
		(
			guestItems: {
				itemType: "comic" | "game" | "toy";
				itemId: string;
				quantity: number;
			}[],
		) => guestItems,
	)
	.handler(async ({ data: guestItems }) => {
		const session = await requireAuth();

		for (const guestItem of guestItems) {
			const [existing] = await db
				.select()
				.from(cartItems)
				.where(
					and(
						eq(cartItems.userId, session.user.id),
						eq(cartItems.itemType, guestItem.itemType),
						eq(cartItems.itemId, guestItem.itemId),
					),
				);

			if (existing) {
				await db
					.update(cartItems)
					.set({ quantity: existing.quantity + guestItem.quantity })
					.where(eq(cartItems.id, existing.id));
			} else {
				await db.insert(cartItems).values({
					id: crypto.randomUUID(),
					userId: session.user.id,
					itemType: guestItem.itemType,
					itemId: guestItem.itemId,
					quantity: guestItem.quantity,
				});
			}
		}
	});
