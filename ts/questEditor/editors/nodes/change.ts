import { ChapterContent_change } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";

export class Editor_Node_change
{
	constructor(private quest: QuestFull, private node: ChapterContent_change, private save: () => void) { }
	public render(body: HTMLElement, collapsed = true)
	{
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
