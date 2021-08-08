import { Button, Div, Span } from "../../../functions.js";
import { ChapterContent_splitter } from "../../../questStructure.js";
import { QuestFull } from "../../functions.js";
import { Editor_Chapter } from "../chapter.js";
import { Editor_Node } from "./node.js";

export class Editor_Node_splitter extends Editor_Node
{
	constructor(quest: QuestFull, public node: ChapterContent_splitter, chapter: Editor_Chapter) { super(quest, chapter); }
	public render(collapsed = true)
	{
		const content = Div([], [
			Div("pg2-line-small", [
				Span("margin-right", [], "Условие:"),
			]),
			Div("pg2-line-small", [
				Span("margin-right", [], "Если условие верно:"),
				Button([], "Редактировать", () =>
				{
					this.node.partIfTrue = this.chapter.openNewPartEditor(this.node.partIfTrue);
				}),
			]),
			Div("pg2-line-small", [
				Span("margin-right", [], "Если условие ложно:"),
				Button([], "Редактировать", () =>
				{
					this.node.partIfFalse = this.chapter.openNewPartEditor(this.node.partIfFalse);
				}),
			]),
		]);
		return this.create(content, [Span([], [], "Разделитель")], collapsed);
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
			partIfTrue: "",
			partIfFalse: "",
		};
		return node;
	}
}
