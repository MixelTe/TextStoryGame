import { Div } from "../../../functions.js";
import { ChapterContent_question } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";

export class Editor_Node_question
{
	constructor(private quest: QuestFull, private node: ChapterContent_question, private save: () => void) { }
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
