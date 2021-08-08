import { Button, confirm_Popup, Div, Select } from "../../functions.js";
import { ChapterPart, ChapterPartNode } from "../../questStructure.js";
import { InputPlus, QuestFull } from "../functions.js";
import { createNode, createNodeTypeSelect, Editor_Nodes, renderNode } from "./nodeTools.js";

export class Editor_Chapter
{
	private partContent = Div("pg2-line");
	private nodeContainer = Div("pg2-line");
	private select = Select();
	private partIndex = 0;
	constructor(private quest: QuestFull, private index: number, public save: () => void) { }
	public render(body: HTMLElement, partIndex = 0, callback = () => {})
	{
		this.partContent = Div("pg2-line");
		body.innerHTML = "";
		this.partIndex = partIndex;
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
		this.renderPart();
	}
	private renderPart()
	{
		this.renderNodes();
		this.select = createNodeTypeSelect();
		this.partContent.appendChild(Div("pg2-line-wrap", [
			this.select,
			Button("margin-right", "Добавить элемент", this.addNode.bind(this)),
		]))
	}
	private renderNodes()
	{
		const content = this.quest.chapters.chapters[this.index][this.partIndex].content;
		this.nodeContainer = Div("pg2-line");
		for (let i = 0; i < content.length; i++)
		{
			this.renderNode(content[i]);
		}
		this.partContent.appendChild(this.nodeContainer);
	}
	private addNode()
	{
		const node = createNode(this.select.value);
		this.quest.chapters.chapters[this.index][this.partIndex].content.push(node);
		this.renderNode(node, false);
	}
	private async removeLast()
	{
		if (!await confirm_Popup(`последний элемент?`)) return;
		if (this.nodeContainer.lastChild) this.nodeContainer.removeChild(this.nodeContainer.lastChild);
		this.quest.chapters.chapters[this.index][this.partIndex].content.pop();
	}
	private renderNode(node: ChapterPartNode, collapsed = true)
	{
		const el = renderNode(node, this.quest, this, collapsed);
		this.nodeContainer.appendChild(el);
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

	public addBefore(node: ChapterPartNode, ref: HTMLElement)
	{
		const el = renderNode(node, this.quest, this, false);
		this.nodeContainer.insertBefore(el, ref);
	}
	public addAfter(node: ChapterPartNode, ref: HTMLElement)
	{
		const el = renderNode(node, this.quest, this, false);
		this.nodeContainer.insertBefore(el, ref.nextSibling);
	}
	public deleteNode(node: Editor_Nodes)
	{
		this.nodeContainer.removeChild(node.nodeBody);
		const content = this.quest.chapters.chapters[this.index][this.partIndex].content;
		const i = content.indexOf(node.node);
		if (i >= 0) content.splice(i, 1);
		this.save();
	}
}