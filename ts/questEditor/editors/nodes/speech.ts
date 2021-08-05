import { Button, Div, Option, Select, SelectPlus, Span } from "../../../functions.js";
import { ChapterContent_speech } from "../../../questStructure.js";
import { InputPlus, QuestFull, TextAreaPlus } from "../../functions.js";
import { Editor_Options } from "../../options.js";

export class Editor_Node_speech
{
	constructor(private quest: QuestFull, private node: ChapterContent_speech, private save: () => void) { }
	public render(body: HTMLElement)
	{
		const deletedChar = this.node.character != "" && this.node.character != "author" && this.quest.characters.find(ch => ch.id == this.node.character) == undefined;
		const emotionsContainer = Div("pg2-line-small");
		const text1 = Span();
		const text2 = Span();
		const content = Div([], [
			Div("pg2-line-small", [
				Span("margin-right", [], "Говорящий:"),
				SelectPlus(
					add =>
					{
						if (deletedChar)
							add("Удалённый персонаж", "deleted", "color-error");
						add("Автор", "author");
						for (let i = 0; i < this.quest.characters.length; i++)
						{
							const ch = this.quest.characters[i];
							add(ch.name, ch.id);
						}
					},
					select =>
					{
						if (select.value != "deleted")
						{
							select.classList.remove("color-error");
							if (deletedChar && select.firstChild)
								select.removeChild(select.firstChild);
							if (select.value != "")
							{
								this.node.character = select.value;
								text1.innerText = select.selectedOptions[0].innerText + ": ";
								this.save();
							}
						}
						if (select.value == "author") emotionsContainer.style.display = "none";
						else emotionsContainer.style.display = "";
					},
					select =>
					{
						if (deletedChar)
						{
							select.value = "deleted";
							select.classList.add("color-error");
						}
						else
						{
							select.value = this.node.character;
							text1.innerText = select.selectedOptions[0].innerText + ": ";
						}
						if (select.value == "author") emotionsContainer.style.display = "none";
					}
				),
			]),
			emotionsContainer,
			Div("pg2-line-small", [
				TextAreaPlus("Текст/речь", [])(
					inp => { this.node.text = inp.value; this.save(); text2.innerText = this.node.text},
					inp => { inp.value = this.node.text; text2.innerText = this.node.text })(),
			]),
		])
		let collapsed = false;
		const block = Div(["pg2-block-small", "pg2-collapsible"], [
			Button("pg2-block-collapse", "-", btn =>
			{
				collapsed = !collapsed;
				btn.innerText = collapsed ? "+" : "-";
				block.classList.toggle("pg2-collapsed", collapsed);
			}),
			Div("pg2-block-header", [text1, text2]),
			content,
		]);
		body.appendChild(block);
		if (Editor_Options.EnableEmotionSelect)
		{
			emotionsContainer.appendChild(Span("margin-right", [], "Эмоция:"));
			emotionsContainer.appendChild(Select([], [
				Option("Спокойствие", "normal"),
				Option("Грусть", "sad"),
				Option("Злость", "angry"),
				Option("Счастье", "happy"),
			],
				select => { this.node.characterImg = <any>select.value; this.save(); },
				select => { select.value = this.node.characterImg; },
			));
		}
	}
	public static createNode()
	{
		const node = <ChapterContent_speech>{
			type: "speech",
			character: "author",
			characterImg: "normal",
			text: ""
		};
		return node;
	}
}
