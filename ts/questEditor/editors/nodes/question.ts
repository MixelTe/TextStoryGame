import { Div } from "../../../functions.js";
import { ChapterContent_question } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";
import { Editor_Chapter } from "../chapter.js";
import { Editor_Node } from "./node.js";

export class Editor_Node_question extends Editor_Node
{
	constructor(quest: QuestFull, public node: ChapterContent_question, chapter: Editor_Chapter) { super(quest, chapter); }
	public render(collapsed = true)
	{
		return Div();
	}
	public static createNode()
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
