import { Div, Option, Select, Span } from "../../../functions.js";
import { ChapterContent_effect } from "../../../questStructure.js";
import { InputPlus, QuestFull } from "../../functions.js";
import { Editor_Chapter } from "../chapter.js";
import { Editor_Node } from "./node.js";

export class Editor_Node_effect extends Editor_Node
{
	constructor(quest: QuestFull, public node: ChapterContent_effect, chapter: Editor_Chapter) { super(quest, chapter); }
	public render(collapsed = true)
	{
		const text1 = Span();
		const text2 = Span();
		const content = Div([], [
			Div("pg2-line-small", [
				Span("margin-right", [], "Эффект:"),
				Select([], [
					Option("Затемнение экрана", "darkScreen"),
					Option("Засветление экрана", "whiteScreen"),
					Option("Тряска экрана", "shake"),
				],
					select => { this.node.effectName = <any>select.value; this.chapter.save(); text1.innerText = select.selectedOptions[0].innerText + ": " },
					select => { select.value = this.node.effectName; text1.innerText = select.selectedOptions[0].innerText + ": " },
				)
			]),
			Div("pg2-line-small", [
				Span("margin-right", [], "Длительность (милисекунды):"),
				InputPlus([], "number", "Длительность")(
					inp =>
					{
						if (isNaN(inp.valueAsNumber)) inp.valueAsNumber = 250;
						this.node.duraction = inp.valueAsNumber;
						this.chapter.save();
						text2.innerText = inp.value;
					},
					inp => { inp.valueAsNumber = this.node.duraction; text2.innerText = inp.value + "мс"; })(),
			]),
		]);
		return this.create(content, [text1, text2], collapsed);
	}
	public static createNode()
	{
		const node = <ChapterContent_effect>{
			type: "effect",
			effectName: "darkScreen",
			duraction: 250,
		};
		return node;
	}
}
