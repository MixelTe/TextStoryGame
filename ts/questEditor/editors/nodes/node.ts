import { Button, confirm_Popup, Div } from "../../../functions.js";
import { contextMenu, Popup } from "../../../popup.js";
import { ChapterPartNode } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";
import { Editor_Chapter } from "../chapter.js";
import { createNode, createNodeTypeSelect } from "../nodeTools.js";

export class Editor_Node
{
	public nodeBody = Div();
	constructor(protected quest: QuestFull, protected chapter: Editor_Chapter) { }
	protected create(content: HTMLDivElement, headerTexts: HTMLElement[], collapsed: boolean)
	{
		const header = Div("pg2-block-header", headerTexts);
		const block = Div(["pg2-block-small", "pg2-collapsible"], [
			Button("pg2-block-collapse", "-", btn =>
			{
				collapsed = !collapsed;
				btn.innerText = collapsed ? "+" : "-";
				block.classList.toggle("pg2-collapsed", collapsed);
			}),
			Button("pg2-block-contextmenu", "···", () =>
			{
				this.nodeContextmenu(header.innerText);
			}),
			header,
			content,
		]);
		block.classList.toggle("pg2-collapsed", collapsed);
		this.nodeBody = block;
		return block;
	}
	private async nodeContextmenu(nodeName: string)
	{
		let nodeNameShort = nodeName.slice(0, 50);
		if (nodeName.length > 50) nodeNameShort += "...";
		const r = await contextMenu(nodeNameShort, [
			{ text: "Добавить элемент", subItems: [
					{ text: "до", id: "add_before" },
					{ text: "после", id: "add_after" },
			]},
			{ text: "Удалить этот элемент", id: "del_this" },
		]);
		if (r == "add_before")
		{
			this.addNodePopup(`Добавить до "${nodeNameShort}"`, node =>
			{
				this.chapter.addBefore(node, this.nodeBody);
			});
		}
		else if (r == "add_after")
		{
			this.addNodePopup(`Добавить после "${nodeNameShort}"`, node =>
			{
				this.chapter.addAfter(node, this.nodeBody);
			});
		}
		else if (r == "del_this")
		{
			if (!await confirm_Popup(`элемент "${nodeName}"?`)) return;
			this.chapter.deleteNode(<any>this);
		}
	}
	private async addNodePopup(title: string, add: (node: ChapterPartNode) => void)
	{
		const popup = new Popup();
		popup.title = title;
		popup.okText = "Добавить";
		const select = createNodeTypeSelect();
		popup.content.classList.add("ta-center");
		popup.content.appendChild(select);
		const r = await popup.openAsync();
		if (r) add(createNode(select.value));
	}
}