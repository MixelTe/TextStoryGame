import { Achievement, Chapter, ChapterPart, Character, Item, Player, Quest } from "../questStructure";

const PREFIX = "questEditor.";
const KEY = "quests";
const P = (key: string) => PREFIX + key;

export function addQuest(quest: QuestItem)
{
	const quests = getQuests();
	quests.push(quest);
	localStorage.setItem(P(KEY), JSON.stringify(quests));
}
export function removeQuest(key: string)
{
	let quests = getQuests();
	quests = quests.filter(q => q.key != key);
	localStorage.setItem(P(KEY), JSON.stringify(quests));
}

export function getQuests()
{
	const quests = localStorage.getItem(P(KEY)) || "[]";
	let parsed = <QuestItem[]>[];
	try
	{
		parsed = <QuestItem[]>JSON.parse(quests) || [];
	}
	catch (e) { }
	return parsed;
}
export function getQuest(key: string)
{
	const quests = localStorage.getItem(P(key));
	if (typeof quests == "string")
	{
		try
		{
			const parsed = <QuestFull>JSON.parse(quests);
			return parsed;
		}
		catch (e) { }
	}
	return createEmptyQuest();
}
export function saveQuest(key: string, quest: QuestFull)
{
	localStorage.setItem(P(key), JSON.stringify(quest));
}
function createEmptyQuest()
{
	const quest = <QuestFull>{
		quest: {
			name: "",
			description: "string",
		},
		characters: [],
		items: [],
		player: {
			items: [],
			characteristics: [],
		},
		achievements: [],
		chapters:
		{
			chaptersList: [],
			chapters: [],
		},
	}
	return quest;
}

interface QuestItem
{
	name: string,
	key: string,
}

export interface QuestFull
{
	quest: Quest,
	characters: Character[],
	items: Item[],
	player: Player,
	achievements: Achievement[],
	chapters: ChapterItem,
}
export interface ChapterItem
{
	chaptersList: Chapter[],
	chapters: ChapterPart[][],
}