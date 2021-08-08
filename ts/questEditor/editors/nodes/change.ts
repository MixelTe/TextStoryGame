import { Div } from "../../../functions.js";
import { ChapterContent_change } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";
import { Editor_Chapter } from "../chapter.js";
import { Editor_Node } from "./node.js";

export class Editor_Node_change extends Editor_Node
{
	constructor(quest: QuestFull, public node: ChapterContent_change, chapter: Editor_Chapter) { super(quest, chapter); }
	public render(collapsed = true)
	{
		return Div();
	}
	public static createNode()
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
