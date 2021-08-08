import { Achievement, Chapter, ChapterPart, Character, Item, Player, Quest } from "../questStructure.js";
import * as SVG from "./svg.js"

const PREFIX = "questEditor.";
const KEY = "quests";
const P = (key: string) => PREFIX + key;

export function addQuest(quest: QuestItem)
{
	const quests = getQuests();
	while (quests.find(el => el.key == quest.key))
	{
		quest.key = `${Math.random()}`.slice(2);
	}
	quests.push(quest);
	localStorage.setItem(P(KEY), JSON.stringify(quests));
}
export function removeQuest(key: string)
{
	let quests = getQuests();
	quests = quests.filter(q => q.key != key);
	const quest = localStorage.getItem(P(key));
	if (quest)
	{
		localStorage.removeItem(P(key));
		// localStorage.setItem(P("deleted." + key), quest);
	}
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
			hasImg: false,
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
	const toButton = (el: SVGSVGElement) =>
	{
		const button = document.createElement("button");
		button.appendChild(el);
		return button;
	}
	const div_svg = document.createElement("div");
	const pencil = toButton(SVG.pencil());
	const close = toButton(SVG.close());
	const save = toButton(SVG.save());
	div_svg.appendChild(pencil);
	div_svg.appendChild(close);
	div_svg.appendChild(save);

	let value = "";
	let onChange = (input: T) => { };
	pencil.addEventListener("click", () =>
	{
		input.disabled = false;
		value = input.value;
		input.focus();
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

export function CheckBox(classes: string[] | string = [], text = "", inline = false)
{
	const name = "checkbox" + Math.random().toString().slice(2);
	const checkBox = document.createElement("input");
	if (typeof classes == "string") checkBox.classList.add(classes);
	else classes.forEach(cs => checkBox.classList.add(cs));
	checkBox.type = "checkbox";
	checkBox.id = name;

	const label = document.createElement("label");
	label.innerText = text;
	label.htmlFor = name;

	const div = document.createElement("div");
	div.classList.add("pg2-checkboxDiv");
	if (inline) div.classList.add("inline");
	div.appendChild(checkBox);
	div.appendChild(label);

	let onChange = (checkBox: HTMLInputElement) => { };
	checkBox.addEventListener("change", () =>
	{
		onChange(checkBox);
	});

	const get = (onChangeF: (checkBox: HTMLInputElement) => void, get?: (checkBox: HTMLInputElement) => void) =>
	{
		if (get) get(checkBox);
		onChange = onChangeF;
		return hmtl;
	}
	const hmtl = () => div;
	return get;
}

export function Form(input: HTMLInputElement, button: HTMLButtonElement, onSubmit: (input: HTMLInputElement, btn: HTMLButtonElement) => void)
{
	const form = document.createElement("form");
	form.classList.add("form");
	form.appendChild(input);
	form.appendChild(button);
	form.addEventListener("submit", e =>
	{
		e.preventDefault();
		onSubmit(input, button);
	});
	return form;
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