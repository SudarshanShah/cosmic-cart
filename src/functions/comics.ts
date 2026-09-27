import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#/db/client";
import { comics } from "#/db/schema";

export const getComics = createServerFn().handler(async () => {
	return await db.select().from(comics);
});

export const getComicById = createServerFn()
	.validator((comicId: string) => comicId)
	.handler(async ({ data: comicId }) => {
		const [comic] = await db.select().from(comics).where(eq(comics.id, comicId));
		if (!comic) throw new Error("Comic not found");
		return comic;
	});
