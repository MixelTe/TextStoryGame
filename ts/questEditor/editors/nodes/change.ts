import { ChapterContent_change } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";

export class Editor_Node_change
{
	constructor(private quest: QuestFull, private indexes: [number, number, number], private save: () => void, createNode = false)
	{
		if (createNode)
		{
			const node = this.createNode();
			this.quest.chapters.chapters[indexes[0]][indexes[1]].content.push(node);
		}
	}
	public render(body: HTMLElement)
	{
		const node = this.quest.chapters.chapters[this.indexes[0]][this.indexes[1]].content[this.indexes[2]];
		if (node.type != "change")
			throw new Error('Editor_Node_change: node.type != "change"');
	}
	private createNode()
	{
		const node = <ChapterContent_change>{
			type: "change",
			achievements: [],
			addItems: [],
			removeItems: [],
			characteristics: [],
			goToPart: undefined,
		};
		return node;
	}
}
