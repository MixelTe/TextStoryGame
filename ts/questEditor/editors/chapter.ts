import { Button, Div, Option, Select } from "../../functions.js";
import { ChapterPart } from "../../questStructure.js";
import { InputPlus, QuestFull } from "../functions.js";
import { Editor_Node_speech } from "./nodes/speech.js";

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
		this.partContent.appendChild(Div("pg2-line", [
			this.select,
			Button("margin-right", "Добавить элемент", this.addNode.bind(this, index)),
			Button([], "Удалить последний", this.removeLast.bind(this, index)),
		]))
	}
	private renderNodes(index: number)
	{
		const content = this.quest.chapters.chapters[this.index][index].content;
		this.nodeContainer = Div("pg2-line");
		for (let i = 0; i < content.length; i++) {
			const node = content[i];
			this.renderNode(node.type, index, i, false);
		}
		this.partContent.appendChild(this.nodeContainer);
	}
	private addNode(index: number)
	{
		const content = this.quest.chapters.chapters[this.index][index].content;
		this.renderNode(this.select.value, index, content.length, true);
	}
	private removeLast(index: number)
	{
		if (this.nodeContainer.lastChild) this.nodeContainer.removeChild(this.nodeContainer.lastChild);
		this.quest.chapters.chapters[this.index][index].content.pop();
	}
	private renderNode(type: string, index: number, i: number, createNode: boolean)
	{
		switch (type) {
			case "speech": new Editor_Node_speech(this.quest, [this.index, index, i], this.save, createNode).render(this.nodeContainer); break;
			case "question": new Editor_Node_speech(this.quest, [this.index, index, i], this.save, createNode).render(this.nodeContainer); break;
			case "effect": new Editor_Node_speech(this.quest, [this.index, index, i], this.save, createNode).render(this.nodeContainer); break;
			case "change": new Editor_Node_speech(this.quest, [this.index, index, i], this.save, createNode).render(this.nodeContainer); break;
			case "splitter": new Editor_Node_speech(this.quest, [this.index, index, i], this.save, createNode).render(this.nodeContainer); break;
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