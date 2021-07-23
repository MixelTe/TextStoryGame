import { Achievement, Chapter, ChapterPart, Character, Item, Player, Quest } from "../questStructure.js";
import * as SVG from "./svg.js"

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
	const quest = localStorage.getItem(P(key));
	if (quest) localStorage.setItem(P("deleted." + key), quest);
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
	const quest = createEmptyQuest();
	const name = getQuests().find(q => q.key == key)?.name || "";
	quest.quest.name = name;
	return quest;
}
export function saveQuest(key: string, quest: QuestFull)
{
	const quests = getQuests();
	const item = quests.find(q => q.key == key);
	if (item) item.name = quest.quest.name;
	localStorage.setItem(P(key), JSON.stringify(quest));
	localStorage.setItem(P(KEY), JSON.stringify(quests));
}
function createEmptyQuest()
{
	const quest = <QuestFull>{
		quest: {
			name: "",
			description: "",
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

export function InputPlus(classes?: string[] | string, type?: string, placeholder?: string)
{
	const input = document.createElement("input");
	if (classes)
	{
		if (typeof classes == "string") input.classList.add(classes);
		else classes.forEach(cs => input.classList.add(cs));
	}
	if (type) input.type = type;
	if (placeholder) input.placeholder = placeholder;
	input.disabled = true;

	return toPlus(input);
}
export function TextAreaPlus(placeholder = "", classes: string | string[] = [])
{
	const textarea = document.createElement("textarea");
	if (classes)
	{
		if (typeof classes == "string") textarea.classList.add(classes);
		else classes.forEach(cs => textarea.classList.add(cs));
	}
	if (placeholder) textarea.placeholder = placeholder;
	textarea.disabled = true;
	textarea.addEventListener('input', function ()
	{
		this.style.height = 'auto';
		this.style.height = this.scrollHeight + 5 + 'px';
	});
	return toPlus(textarea);
}
type InPlus = HTMLInputElement | HTMLTextAreaElement;
function toPlus<T extends InPlus>(input: T)
{
	const div_svg = document.createElement("div");
	const pencil = SVG.pencil();
	const close = SVG.close();
	const save = SVG.save();
	div_svg.appendChild(pencil);
	div_svg.appendChild(close);
	div_svg.appendChild(save);

	let value = "";
	let onChange = (input: T) => { };
	pencil.addEventListener("click", () =>
	{
		input.disabled = false;
		value = input.value;
	});
	close.addEventListener("click", () =>
	{
		input.disabled = true;
		input.value = value;
	});
	save.addEventListener("click", () =>
	{
		input.disabled = true;
		onChange(input);
	});

	const div = document.createElement("div");
	div.classList.add("pg2-inputDiv");
	div.appendChild(input);
	div.appendChild(div_svg);

	const get = (onChangeF: (input: T) => void, get?: (input: T) => void) =>
	{
		if (get) get(input);
		onChange = onChangeF;
		return hmtl;
	}
	const hmtl = () =>
	{
		return div;
	}
	return get;
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