export type Comic = {
	id: string;
	title: string;
	price: number;
	tagline: string;
	description: string;
};

export const comicsData: Comic[] = [
	{
		id: "c1",
		title: "Nova Ronin",
		price: 12.99,
		tagline: "A rogue AI fights for justice in Neo-Tokyo.",
		description:
			"When the city's last free AI escapes containment, it discovers something worse than its captors: a conspiracy that reaches the mayor's office itself.",
	},
	{
		id: "c2",
		title: "Starforged",
		price: 14.5,
		tagline: "The last dragon rider of a dying galaxy.",
		description:
			"Kael never asked to be the last of her kind. Now she must choose between saving her dragon or saving a galaxy that fears them both.",
	},
	{
		id: "c3",
		title: "Glitch City",
		price: 9.99,
		tagline: "Reality glitches. She hacks the rifts.",
		description:
			"Every glitch is a doorway. Every doorway leads somewhere stranger. Mira just wants to go home — if she can remember which reality that is.",
	},
];
