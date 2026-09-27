import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#/db/client";
import { games } from "#/db/schema";

export const getGames = createServerFn().handler(async () => {
	return await db.select().from(games);
});

export const getGameById = createServerFn()
	.validator((gameId: string) => gameId)
	.handler(async ({ data: gameId }) => {
		const [game] = await db.select().from(games).where(eq(games.id, gameId));
		if (!game) throw new Error("Game not found");
		return game;
	});