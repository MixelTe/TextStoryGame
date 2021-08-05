import { ChapterContent_question } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";

export class Editor_Node_question
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
		if (node.type != "question")
			throw new Error('Editor_Node_question: node.type != "question"');
	}
	private createNode()
	{
		const node = <ChapterContent_question>{
			type: "question",
			character: "author",
			characterImg: "normal",
			text: "",
			actions: []
		};
		return node;
	}
}
