import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#/db/client";
import { toys } from "#/db/schema";

export const getToys = createServerFn().handler(async () => {
	return await db.select().from(toys);
});

export const getToyById = createServerFn()
	.validator((toyId: string) => toyId)
	.handler(async ({ data: toyId }) => {
		const [toy] = await db.select().from(toys).where(eq(toys.id, toyId));
		if (!toy) throw new Error("Toy not found");
		return toy;
	});