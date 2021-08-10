import { Button, Div, Option, Select, Span } from "../../functions.js";
import { ChapterPartNode } from "../../questStructure.js";
import { QuestFull } from "../functions.js";
import { Editor_Chapter } from "./chapter.js";
import { Editor_Node_change } from "./nodes/change.js";
import { Editor_Node_effect } from "./nodes/effect.js";
import { Editor_Node_question } from "./nodes/question.js";
import { Editor_Node_speech } from "./nodes/speech.js";
import { Editor_Node_splitter } from "./nodes/splitter.js";

export type Editor_Nodes = Editor_Node_speech | Editor_Node_question | Editor_Node_effect | Editor_Node_change | Editor_Node_splitter;
export function createNodeTypeSelect()
{
	return Select([], [
		Option("Текст/речь", "speech"),
		Option("Вопрос", "question"),
		Option("Эффект", "effect"),
		Option("Именение", "change"),
		Option("Разделитель", "splitter"),
	]);
}
export function createNode(type: string)
{
	switch (type) {
		case "speech": return Editor_Node_speech.createNode();
		case "question": return Editor_Node_question.createNode();
		case "effect": return Editor_Node_effect.createNode();
		case "change": return Editor_Node_change.createNode();
		case "splitter": return Editor_Node_splitter.createNode();
		default: throw new Error(`Unexpected node type: ${type}`);
	}
}
export function renderNode(node: ChapterPartNode, quest: QuestFull, chapter: Editor_Chapter, collapsed: boolean)
{
	const type = node.type;
	switch (node.type) {
		case "speech": return new Editor_Node_speech(quest, node, chapter).render(collapsed);
		case "question": return new Editor_Node_question(quest, node, chapter).render(collapsed);
		case "effect": return new Editor_Node_effect(quest, node, chapter).render(collapsed);
		case "change": return new Editor_Node_change(quest, node, chapter).render(collapsed);
		case "splitter": return new Editor_Node_splitter(quest, node, chapter).render(collapsed);
		default: throw new Error(`Unexpected node type: ${type}`);
	}
}
export function createSelectEl(name: string, els: { id: string, name: string }[])
{
	const select = document.createElement("select");
	const option = document.createElement("option");
	option.value = "";
	option.innerText = name;
	select.appendChild(option);
	els.forEach(el => {
		const option = document.createElement("option");
		option.value = el.id;
		option.innerText = el.name;
		select.appendChild(option);
	});
	return select;
}
export function createSelectCharacteristic(quest: QuestFull)
{
	const select = document.createElement("select");
	const option = document.createElement("option");
	option.value = "";
	option.innerText = "Выберите характеристику";
	select.appendChild(option);
	quest.player.characteristics.forEach(ch => {
		const option = document.createElement("option");
		option.value = ch.id;
		option.innerText = ch.name;
		select.appendChild(option);
	});
	quest.characters.forEach(ch => {
		const option = document.createElement("option");
		option.value = ch.id;
		option.innerText = `Ур. дружбы с ${ch.name}`;
		select.appendChild(option);
	});
	return select;
}

export function createItems(quest: QuestFull, items: string[], onChange: () => void = () => {})
{
	return createInlineList(quest.items, items, onChange);
}
export function itemAdder(quest: QuestFull, container: HTMLDivElement, items: string[], onChange: () => void = () => {}, resetSelect = false, onAdd: (v: string) => boolean = () => true)
{
	return elAdder(quest.items, container, items, "предмет", onChange, resetSelect, onAdd);
}
export function createAchievements(quest: QuestFull, achievements: string[], onChange: () => void = () => {})
{
	return createInlineList(quest.achievements, achievements, onChange);
}
export function achievementsAdder(quest: QuestFull, container: HTMLDivElement, achievements: string[], onChange: () => void = () => {}, resetSelect = false, onAdd: (v: string) => boolean = () => true)
{
	return elAdder(quest.achievements, container, achievements, "достижение", onChange, resetSelect, onAdd);
}

function createInlineList(base: { id: string, name: string }[], ids: string[], onChange: () => void = () => { })
{
	const container = Div("pg2-line-small", []);
	for (let i = 0; i < ids.length; i++) {
		createEl(base, i, ids, container, onChange);
		if (i < ids.length - 1)
		{
			container.appendChild(Span([], [], ", "));
		}
	}
	return container;
}
function createEl(base: { id: string, name: string }[], i: number, ids: string[], container: HTMLDivElement, onChange: () => void = () => {})
{
	const item = ids[i];
	const itemName = base.find(el => el.id == item);
	const style = itemName == undefined ? ["color-error"] : [];
	const el = Span("nowrpap", [
		Button("pg2-inline-remove", "-", () =>
		{
			const i = ids.indexOf(item);
			if (i >= 0) ids.splice(i, 1);
			if (el.previousSibling) container.removeChild(el.previousSibling);
			else if (el.nextSibling) container.removeChild(el.nextSibling);
			container.removeChild(el);
			onChange();
		}),
		Span(style, [], itemName?.name ?? "Удалённый предмет"),
	]);
	container.appendChild(el);
}
function elAdder(base: { id: string, name: string }[], container: HTMLDivElement, items: string[], name: string, onChange: () => void = () => {}, resetSelect = false, onAdd: (v: string) => boolean = () => true)
{
	const select = createSelectEl("Выберите " + name, base);
	const line = Div("pg2-line-small-wrap", [
		select,
		Button([], "Добавить " + name, () =>
		{
			if (typeof select.value == "string" && select.value != "")
			{
				if (!onAdd(select.value)) return;
				if (items.length > 0) container.appendChild(Span([], [], ", "));
				items.push(select.value);
				createEl(base, items.length - 1, items, container);
				onChange();
				if (resetSelect) select.value = "";
			}
		}),
	]);
	return line;
}
