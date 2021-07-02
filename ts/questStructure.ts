// Quest structure:
// questFolder (quest№)
// - quest.json // Quest
// - characters.json // Character[]
// - items.json // Item[]
// - player.json // Player
// - achievements.json // Achievement[]
// - chapters
// - - chapters.json // Chapter[]
// - - chapter№
// - - - part№.json // ChapterPart
// - images
// - - cover.png
// - - background
// - - - name.png
// - - items
// - - - id.png
// - - characteristics
// - - - id // Characteristic.id
// - - - - icon.png
// - - - - lose.png
// - - characters
// - - - characterId
// - - - - angry.png
// - - - - happy.png
// - - - - normal.png
// - - - - sad.png
export type ChapterPartContent = (ChapterContent_speech | ChapterContent_question | ChapterContent_effect | ChapterContent_change)[];
export interface Quest
{
	name: string;
	description: string;
}

export interface Character
{
	id: string;
	name: string;
	description: string;
	friendLevel: number;
}

export interface Item
{
	id: string;
	name: string;
	description: string;
}

export interface Player
{
	items: string[]; // Items id
	characteristics: Characteristic[];
}

export interface Achievement
{
	id: string;
	name: string;
	description: string;
}

export interface Characteristic
{
	id: string;
	name: string;
	description: string;
	value: number;
	loseIfBelowZero: boolean;
	loseText: string;
	hasLoseImg: boolean;
}

export interface Chapter
{
	name: string;
	partsCount: number;
}

export interface ChapterPart
{
	id: string;
	backImg: string; // img name
	content: ChapterPartContent;
}

export interface ChapterContent_speech
{
	type: "speech";
	characterId: string;
	characterImg: "normal" | "sad" | "angry" | "happy";
	text: string;
}

export interface ChapterContent_question
{
	type: "question";
	characterId: string;
	characterImg: "normal" | "sad" | "angry" | "happy";
	text: string;
	actions: Action[];
}
export interface ChapterContent_effect
{
	type: "effect";
	effectName: "darkScreen" | "whiteScreen" | "shake";
	duraction: number;
}
export interface ChapterContent_change
{
	type: "change";
	achievements: string[]; // achievements id
	addItems: string[]; // items id
	removeItems: string[]; // items id
	goToPart?: string; // part id
	characteristics: ChangeCharacteristics[];
}

export interface Action
{
	text: string;
	conditions?: Condition;
	showConditions?: Condition;
	content: ChapterPartContent;
}

export interface Condition
{
	partsDone: string[]; // parts id
	partsNotDone: string[];
	characteristics: ConditionCharacteristic[];
	items: string[]; // items id
}

export interface ConditionCharacteristic
{
	id: string;
	lessThen?: number;
	moreThen?: number;
}

export interface ChangeCharacteristics
{
	id: string;
	to?: number;
	by?: number;
}