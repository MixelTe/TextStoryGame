// Quest structure:
// questFolder (quest№)
// - quest.json // Quest
// - characters.json // Character[]
// - items.json // Item[]
// - player.json // Player
// - chapters
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
export type ChapterPartContent = (ChapterContent_speech | ChapterContent_question | ChapterContent_effect)[];
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
export interface Characteristic
{
	id: string;
	name: string;
	description: string;
	value: number;
	namesForNums: string[]; // [(один)"чайник", (два)"чайника", (много)"чайников"]
	loseIfBelowZero: boolean;
	loseText: string;
	hasLoseImg: boolean;
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

export interface Action
{
	text: string;
	conditions?: Condition;
	showConditions?: Condition;
	result: ActionResult;
}

export interface Condition
{
	partsDone: string[]; // parts id
	partsNotDone: string[];
	characteristic: ConditionCharacteristic[];
	items: string[]; // items id
}

export interface ConditionCharacteristic
{
	id: string;
	lessThen?: number;
	moreThen?: number;
}

export interface ActionResult
{
	goToPart?: string; // part id
	addItems: string[]; // items id
	changeCharacteristics: ChangeCharacteristics[];
	content: ChapterPartContent;
}

export interface ChangeCharacteristics
{
	id: string;
	to?: number;
	by?: number;
}