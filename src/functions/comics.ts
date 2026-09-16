import { createServerFn } from "@tanstack/react-start";
import { comicsData } from "#/data/comics";

export const getComics = createServerFn().handler(async () => {
	// Pretend this is a DB call: await db.comics.findMany()
	return comicsData;
});

export const getComicById = createServerFn()
	.validator((comicId: string) => comicId)
	.handler(async ({ data: comicId }) => {
		// Pretend this is: await db.comics.findUnique({ where: { id: comicId } })
		const comic = comicsData.find((c) => c.id === comicId);
		if (!comic) throw new Error("Comic not found");
		return comic;
	});
