import { Div, Option, Select, Span } from "../../../functions.js";
import { ChapterContent_effect } from "../../../questStructure.js";
import { InputPlus, QuestFull } from "../../functions.js";
import { nodeContainer } from "./node.js";

export class Editor_Node_effect
{
	constructor(private quest: QuestFull, private node: ChapterContent_effect, private save: () => void) { }
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
					select => { this.node.effectName = <any>select.value; this.save(); text1.innerText = select.selectedOptions[0].innerText + ": " },
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
						this.save();
						text2.innerText = inp.value;
					},
					inp => { inp.valueAsNumber = this.node.duraction; text2.innerText = inp.value + "мс"; })(),
			]),
		]);
		return nodeContainer(content, [text1, text2], collapsed);
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
