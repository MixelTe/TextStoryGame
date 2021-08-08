import { Option, Select } from "../../functions.js";
import { ChapterPartNode } from "../../questStructure.js";
import { QuestFull } from "../functions.js";
import { Editor_Node_change } from "./nodes/change.js";
import { Editor_Node_effect } from "./nodes/effect.js";
import { Editor_Node_question } from "./nodes/question.js";
import { Editor_Node_speech } from "./nodes/speech.js";
import { Editor_Node_splitter } from "./nodes/splitter.js";

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
	let node: ChapterPartNode;
	switch (type) {
		case "speech": node = Editor_Node_speech.createNode(); break;
		case "question": node = Editor_Node_question.createNode(); break;
		case "effect": node = Editor_Node_effect.createNode(); break;
		case "change": node = Editor_Node_change.createNode(); break;
		case "splitter": node = Editor_Node_splitter.createNode(); break;
		default: throw new Error(`Unexpected node type: ${type}`);
	}
	return node;
}
export function renderNode(node: ChapterPartNode, quest: QuestFull, save: () => void, collapsed: boolean)
{
	const type = node.type;
	let nodeEl: HTMLDivElement;
	switch (node.type) {
		case "speech": nodeEl = new Editor_Node_speech(quest, node, save).render(collapsed); break;
		case "question": nodeEl = new Editor_Node_question(quest, node, save).render(collapsed); break;
		case "effect": nodeEl = new Editor_Node_effect(quest, node, save).render(collapsed); break;
		case "change": nodeEl = new Editor_Node_change(quest, node, save).render(collapsed); break;
		case "splitter": nodeEl = new Editor_Node_splitter(quest, node, save).render(collapsed); break;
		default: throw new Error(`Unexpected node type: ${type}`);
	}
	return nodeEl;
}