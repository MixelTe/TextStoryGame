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
	switch (type) {
		case "speech": return Editor_Node_speech.createNode();
		case "question": return Editor_Node_question.createNode();
		case "effect": return Editor_Node_effect.createNode();
		case "change": return Editor_Node_change.createNode();
		case "splitter": return Editor_Node_splitter.createNode();
		default: throw new Error(`Unexpected node type: ${type}`);
	}
}
export function renderNode(node: ChapterPartNode, quest: QuestFull, save: () => void, collapsed: boolean)
{
	const type = node.type;
	switch (node.type) {
		case "speech": return new Editor_Node_speech(quest, node, save).render(collapsed);
		case "question": return new Editor_Node_question(quest, node, save).render(collapsed);
		case "effect": return new Editor_Node_effect(quest, node, save).render(collapsed);
		case "change": return new Editor_Node_change(quest, node, save).render(collapsed);
		case "splitter": return new Editor_Node_splitter(quest, node, save).render(collapsed);
		default: throw new Error(`Unexpected node type: ${type}`);
	}
}