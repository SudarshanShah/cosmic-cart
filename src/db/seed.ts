import "dotenv/config";
import { db } from "./client";
import { comics, games, toys } from "./schema";

const comicsData = [
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

const gamesData = [
	{
		id: "g1",
		title: "Nebula Drift",
		price: 39.99,
		tagline: "A racing game across dying stars.",
		description:
			"Race across collapsing star systems where the track itself is falling apart beneath you. Every lap is a gamble against physics.",
	},
	{
		id: "g2",
		title: "Ashen Keep",
		price: 49.99,
		tagline: "A dark-fantasy survival roguelike.",
		description:
			"The keep remembers every death. Rebuild, fall again, and slowly uncover why the ash never stops falling.",
	},
	{
		id: "g3",
		title: "Pixel Legion",
		price: 24.99,
		tagline: "Retro tactics, modern chaos.",
		description:
			"Command a squad of 16-bit soldiers through a war that keeps rewriting its own rules mid-battle.",
	},
];

const toysData = [
	{
		id: "t1",
		title: "Galaxy Blaster",
		price: 19.99,
		tagline: "Foam darts, cosmic style.",
		description:
			"A hand-cranked blaster with glow-in-the-dark darts and a satisfying thunk. Ages 6+.",
	},
	{
		id: "t2",
		title: "Mecha Buddy",
		price: 34.99,
		tagline: "A collectible transforming robot pal.",
		description:
			"Twelve points of articulation and a transform sequence that takes way longer than it should — in a good way.",
	},
	{
		id: "t3",
		title: "Starlight Plush",
		price: 14.99,
		tagline: "Soft, glowing, impossibly cute.",
		description:
			"A plush star with a soft internal LED that pulses gently. Battery included, hugs guaranteed.",
	},
];

async function seed() {
	await db.insert(comics).values(comicsData).onConflictDoNothing();
	await db.insert(games).values(gamesData).onConflictDoNothing();
	await db.insert(toys).values(toysData).onConflictDoNothing();
	console.log("Seeded comics, games, and toys tables.");
	process.exit(0);	
}

seed();
