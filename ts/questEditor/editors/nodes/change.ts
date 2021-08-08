import { Div } from "../../../functions.js";
import { ChapterContent_change } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";

export class Editor_Node_change
{
	constructor(private quest: QuestFull, private node: ChapterContent_change, private save: () => void) { }
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
