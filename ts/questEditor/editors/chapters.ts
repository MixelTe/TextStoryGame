import { Button, confirm_Popup, Div, Input } from "../../functions.js";
import { Form, QuestFull } from "../functions.js";
import { Editor_Chapter } from "./chapter.js";

export class Editor_Chapters
{
	public opened = false;
	constructor(private quest: QuestFull, private save: () => void) { }
	public render(body: HTMLElement)
	{
		const input = Input([], "text", "Название главы");
		this.opened = false;
		body.innerHTML = "";
		body.appendChild(Div([], [
			Div("list", this.renderQuests(body)),
			Div("add-item", [
				Form(input, Button([], "Добавить главу"), this.addChapter.bind(this, body, input)),
			]),
		]));
	}
	private renderQuests(body: HTMLElement)
	{
		const chapters = this.quest.chapters.chaptersList;
		const rendered = [];
		for (let i = 0; i < chapters.length; i++)
		{
			const chapter = chapters[i];
			const button = Button("pg2-btn-delete", "X", async () =>
			{
				if (await this.removeChapter(i))
				{
					this.render(body);
				}
			});
			const div = Div([], [
				Div([], [], chapter.name),
				button,
			]);
			rendered.push(div);
			div.addEventListener("click", e =>
			{
				if (e.target != button)
				{
					new Editor_Chapter(this.quest, i, this.save).render(body);
					this.opened = true;
				}
			});
		}
		return rendered;
	}
	private addChapter(body: HTMLElement, input: HTMLInputElement)
	{
		if (typeof input.value != 'string' || input.value == "") return;
		const chapter = { name: input.value, partsCount: 0 };
		input.value = "";

		this.quest.chapters.chaptersList.push(chapter);
		this.quest.chapters.chapters.push([]);
		this.save();

		this.render(body);
	}
	private async removeChapter(index: number)
	{
		if (!await confirm_Popup(`главу ${this.quest.chapters.chaptersList[index].name}?`)) return false;
		if (!await confirm_Popup(`главу ${this.quest.chapters.chaptersList[index].name}? И ВСЁ её содержимое!`, true)) return false;
		if (!await confirm_Popup(`главу ${this.quest.chapters.chaptersList[index].name}? И ВСЁ её содержимое! Безвозвратно!`)) return false;
		if (!await confirm_Popup(`главу ${this.quest.chapters.chaptersList[index].name}? И ВСЁ её содержимое! Безвозвратно! Насовсем!`, true)) return false;
		this.quest.chapters.chaptersList.splice(index, 1);
		this.quest.chapters.chapters.splice(index, 1);
		this.save();
		return true;
	}
}
