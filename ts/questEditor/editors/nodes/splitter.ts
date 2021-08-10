import { Button, Div, Span } from "../../../functions.js";
import { ChapterContent_splitter } from "../../../questStructure.js";
import { CheckBox, QuestFull } from "../../functions.js";
import { Editor_Chapter } from "../chapter.js";
import { Editor_condition } from "./condition.js";
import { Editor_Node } from "./node.js";

export class Editor_Node_splitter extends Editor_Node
{
	constructor(quest: QuestFull, public node: ChapterContent_splitter, chapter: Editor_Chapter) { super(quest, chapter); }
	public render(collapsed = true)
	{
		const truePart = Div("pg2-line-small", [
			Button([], "Редактировать", () =>
			{
				this.node.partIfTrue = this.chapter.openNewPartEditor(this.node.partIfTrue || "");
			}),
		]);
		const falsePart = Div("pg2-line-small", [
			Button([], "Редактировать", () =>
			{
				this.node.partIfFalse = this.chapter.openNewPartEditor(this.node.partIfFalse || "");
			}),
		]);
		const truePartNotEmpty = this.chapter.hasPartContent(this.node.partIfTrue);
		const falsePartNotEmpty = this.chapter.hasPartContent(this.node.partIfFalse);
		truePart.style.display = truePartNotEmpty ? "" : "none";
		falsePart.style.display = falsePartNotEmpty ? "" : "none";
		const content = Div([], [
			Div("pg2-line-small", [
				Span("margin-right", [], "Условие:"),
				Button([], "Редактировать", async () =>
				{
					await new Editor_condition(this.quest, this.node.conditions).open();
					this.chapter.save();
				}),
			]),
			Div("pg2-line-small", [
				CheckBox([], "Действия если условие верно")(
					inp =>
					{
						truePart.style.display = inp.checked ? "" : "none";
					},
					inp =>
					{
						inp.checked = truePartNotEmpty;
						if (truePartNotEmpty) inp.disabled = true;
					})(),
			]),
			truePart,
			Div("pg2-line-small", [
				CheckBox([], "Действия если условие ложно")(
					inp =>
					{
						falsePart.style.display = inp.checked ? "" : "none";
					},
					inp =>
					{
						inp.checked = falsePartNotEmpty;
						if (falsePartNotEmpty) inp.disabled = true;
					})(),
			]),
			falsePart,
		]);
		return this.create(content, [Span([], [], "Разделитель")], collapsed);
	}

	public static createNode()
	{
		const node = <ChapterContent_splitter>{
			type: "splitter",
			conditions: Editor_condition.createNode(),
		};
		return node;
	}
}
