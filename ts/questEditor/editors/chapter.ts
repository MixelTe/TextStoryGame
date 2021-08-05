import { Button, Div, Option, Select } from "../../functions.js";
import { ChapterPart, ChapterPartNode } from "../../questStructure.js";
import { InputPlus, QuestFull } from "../functions.js";
import { Editor_Node_change } from "./nodes/change.js";
import { Editor_Node_effect } from "./nodes/effect.js";
import { Editor_Node_question } from "./nodes/question.js";
import { Editor_Node_speech } from "./nodes/speech.js";
import { Editor_Node_splitter } from "./nodes/splitter.js";

export class Editor_Chapter
{
	private partContent = Div("pg2-line");
	private nodeContainer = Div("pg2-line");
	private select = Select();
	constructor(private quest: QuestFull, private index: number, private save: () => void) { }
	public render(body: HTMLElement, partIndex = 0, callback = () => {})
	{
		this.partContent = Div("pg2-line");
		body.innerHTML = "";
		if (partIndex == 0)
		{
			body.appendChild(Div([], [
				Div("pg2-line", [
					InputPlus(["pg2", "ta-center"], "text", "Название главы")(
						inp => { this.quest.chapters.chaptersList[this.index].name = inp.value; this.save(); },
						inp => inp.value = this.quest.chapters.chaptersList[this.index].name)(),
				]),
				this.partContent,
			]));
		}
		else
		{
			body.appendChild(Div([], [
				Div(["pg2-line", "ta-center"], [
					Button([], "На уровень выше", callback),
				]),
				this.partContent,
			]));
		}
		this.createIfNotExist();
		this.renderPart(partIndex);
	}
	private renderPart(index: number)
	{
		this.renderNodes(index);
		this.select = Select([], [
			Option("Текст/речь", "speech"),
			Option("Вопрос", "question"),
			Option("Эффект", "effect"),
			Option("Именение", "change"),
			Option("Разделитель", "splitter"),
		]);
		this.partContent.appendChild(Div("pg2-line-wrap", [
			this.select,
			Button("margin-right", "Добавить элемент", this.addNode.bind(this, index)),
			Button([], "Удалить последний", this.removeLast.bind(this, index)),
		]))
	}
	private renderNodes(index: number)
	{
		const content = this.quest.chapters.chapters[this.index][index].content;
		this.nodeContainer = Div("pg2-line");
		for (let i = 0; i < content.length; i++)
		{
			this.renderNode(content[i]);
		}
		this.partContent.appendChild(this.nodeContainer);
	}
	private addNode(index: number)
	{
		let node: ChapterPartNode;
		switch (this.select.value) {
			case "speech": node = Editor_Node_speech.createNode(); break;
			case "question": node = Editor_Node_question.createNode(); break;
			case "effect": node = Editor_Node_effect.createNode(); break;
			case "change": node = Editor_Node_change.createNode(); break;
			case "splitter": node = Editor_Node_splitter.createNode(); break;
			default: throw new Error(`Unexpected value: ${this.select.value}`);
		}
		this.quest.chapters.chapters[this.index][index].content.push(node);
		this.renderNode(node);
	}
	private removeLast(index: number)
	{
		if (this.nodeContainer.lastChild) this.nodeContainer.removeChild(this.nodeContainer.lastChild);
		this.quest.chapters.chapters[this.index][index].content.pop();
	}
	private renderNode(node: ChapterPartNode)
	{
		switch (node.type) {
			case "speech": new Editor_Node_speech(this.quest, node, this.save).render(this.nodeContainer); break;
			case "question": new Editor_Node_question(this.quest, node, this.save).render(this.nodeContainer); break;
			case "effect": new Editor_Node_effect(this.quest, node, this.save).render(this.nodeContainer); break;
			case "change": new Editor_Node_change(this.quest, node, this.save).render(this.nodeContainer); break;
			case "splitter": new Editor_Node_splitter(this.quest, node, this.save).render(this.nodeContainer); break;
			default: throw new Error(`Unexpected value: ${this.select.value}`);
		}
	}

	private createIfNotExist()
	{
		const chapter = this.quest.chapters.chapters[this.index];
		if (chapter.length == 0)
		{
			chapter.push(this.createPart());
		}
	}
	private createPart()
	{
		const part = <ChapterPart>{
			backImg: "",
			id: "0",
			content: [],
		};
		return part;
	}
}