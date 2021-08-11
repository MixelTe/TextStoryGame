import { Button, confirm_Popup, Div, Select } from "../../functions.js";
import { ChapterPart, ChapterPartNode } from "../../questStructure.js";
import { InputPlus, QuestFull } from "../functions.js";
import { createNode, createNodeTypeSelect, Editor_Nodes, renderNode } from "./nodeTools.js";

export class Editor_Chapter
{
	private partContent = Div("pg2-line");
	private nodeContainer = Div("pg2-line");
	private select = Select();
	private partId = "0";
	private partIndex = 0;
	public openNewPartEditor = (partId: string) => "0";
	constructor(private quest: QuestFull, private index: number, public save: () => void) { }
	public render(body: HTMLElement, partId = "0", callback = () => {})
	{
		this.partContent = Div("pg2-line");
		body.innerHTML = "";
		this.partId = partId;
		this.partIndex = this.getIndex(this.partId);
		if (this.partId == "0")
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
		this.openNewPartEditor = (newPartId: string) =>
		{
			return new Editor_Chapter(this.quest, this.index, this.save).render(body, newPartId, () =>
			{
				this.render(body, partId, callback);
			});
		}
		this.renderPart();
		return this.quest.chapters.chapters[this.index][this.partIndex].id;
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
			this.renderNode(content[i], i != content.length - 1);
		}
		this.partContent.appendChild(this.nodeContainer);
	}
	private addNode()
	{
		const node = createNode(this.select.value);
		this.quest.chapters.chapters[this.index][this.partIndex].content.push(node);
		this.renderNode(node, false);
	}
	private renderNode(node: ChapterPartNode, collapsed = true)
	{
		const el = renderNode(node, this.quest, this, collapsed);
		this.nodeContainer.appendChild(el);
	}

	private getIndex(id: string)
	{
		const chapter = this.quest.chapters.chapters[this.index];
		const i = chapter.findIndex(ch => ch.id == id);
		if (i < 0)
		{
			const part = this.createPart(this.createNewPartId());
			chapter.push(part);
			return chapter.length - 1;
		}
		return i;
	}
	private createNewPartId()
	{
		const chapter = this.quest.chapters.chapters[this.index];
		if (chapter.length == 0) return "0";
		let num = parseInt(chapter[chapter.length - 1].id);
		if (isNaN(num)) num = Date.now();
		return `${num + 1}`;
	}
	private createPart(id: string)
	{
		const part = <ChapterPart>{
			backImg: "",
			id,
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
	public hasPartContent(partId: string | undefined)
	{
		if (partId == undefined) return false;
		const chapter = this.quest.chapters.chapters[this.index];
		const part = chapter.find(ch => ch.id == partId);
		if (part == undefined) return false;
		return part.content.length != 0;
	}
}