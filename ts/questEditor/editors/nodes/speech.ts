import { Div, Option, Select, SelectPlus, Span } from "../../../functions.js";
import { ChapterContent_speech } from "../../../questStructure.js";
import { InputPlus, QuestFull } from "../../functions.js";
import { Editor_Options } from "../../options.js";

export class Editor_Node_speech
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
		if (node.type != "speech")
			throw new Error('Editor_Node_speech: node.type != "speech"');
		const deletedChar = node.character != "" && node.character != "author" && this.quest.characters.find(ch => ch.id == node.character) == undefined;
		const emotionsContainer = Div("pg2-line-small");
		body.appendChild(Div("pg2-block-small", [
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
								node.character = select.value;
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
						else select.value = node.character;
						if (select.value == "author") emotionsContainer.style.display = "none";
					}
				),
			]),
			emotionsContainer,
			Div("pg2-line-small", [
				InputPlus([], "text", "Текст/речь")(
					inp => { node.text = inp.value; this.save(); },
					inp => { inp.value = node.text; })(),
			]),
		]));
		if (Editor_Options.EnableEmotionSelect)
		{
			emotionsContainer.appendChild(Span("margin-right", [], "Эмоция:"));
			emotionsContainer.appendChild(Select([], [
				Option("Спокойствие", "normal"),
				Option("Грусть", "sad"),
				Option("Злость", "angry"),
				Option("Счастье", "happy"),
			],
				select => { node.characterImg = <any>select.value; this.save(); },
				select => { select.value = node.characterImg; },
			));
		}
	}
	private createNode()
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
