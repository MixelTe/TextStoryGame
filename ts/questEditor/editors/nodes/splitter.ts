import { Div } from "../../../functions.js";
import { ChapterContent_splitter } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";
import { Editor_Chapter } from "../chapter.js";
import { Editor_Node } from "./node.js";

export class Editor_Node_splitter extends Editor_Node
{
	constructor(quest: QuestFull, public node: ChapterContent_splitter, chapter: Editor_Chapter) { super(quest, chapter); }
	public render(collapsed = true)
	{
		return Div();
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
