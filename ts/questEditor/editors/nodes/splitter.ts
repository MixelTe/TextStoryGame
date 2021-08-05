import { ChapterContent_splitter } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";

export class Editor_Node_splitter
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
		if (node.type != "splitter")
			throw new Error('Editor_Node_splitter: node.type != "splitter"');
	}
	private createNode()
	{
		const node = <ChapterContent_splitter>{
			type: "splitter",
			conditions: {
				characteristics: [],
				items: [],
				itemsNot: [],
				partsDone: [],
				partsNotDone: [],
			},
			contentIfFalse: [],
			contentIfTrue: [],
		};
		return node;
	}
}
