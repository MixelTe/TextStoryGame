import { ChapterContent_splitter } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";

export class Editor_Node_splitter
{
	constructor(private quest: QuestFull, private node: ChapterContent_splitter, private save: () => void) { }
	public render(body: HTMLElement, collapsed = true)
	{

	}
	public static createNode()
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
