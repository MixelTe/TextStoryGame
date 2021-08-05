import { Div, Option, Select, Span } from "../../../functions.js";
import { ChapterContent_effect } from "../../../questStructure.js";
import { InputPlus, QuestFull } from "../../functions.js";

export class Editor_Node_effect
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
		if (node.type != "effect")
			throw new Error('Editor_Node_effect: node.type != "effect"');
		body.appendChild(Div("pg2-block-small", [
			Div("pg2-line-small", [
				Span("margin-right", [], "Эффект:"),
				Select([], [
					Option("Затемнение экрана", "darkScreen"),
					Option("Засветление экрана", "whiteScreen"),
					Option("Тряска экрана", "shake"),
				],
					select => { node.effectName = <any>select.value; this.save(); },
					select => { select.value = node.effectName; },
				)
			]),
			Div("pg2-line-small", [
				Span("margin-right", [], "Длительность:"),
				InputPlus([], "number", "Длительность")(
					inp =>
					{
						if (isNaN(inp.valueAsNumber)) inp.valueAsNumber = 250;
						node.duraction = inp.valueAsNumber;
						this.save();
					},
					inp => { inp.valueAsNumber = node.duraction; })(),
			]),
		]));
	}
	private createNode()
	{
		const node = <ChapterContent_effect>{
			type: "effect",
			effectName: "darkScreen",
			duraction: 250,
		};
		return node;
	}
}
