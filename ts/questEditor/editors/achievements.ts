import { Button, Div } from "../../functions.js";
import { Achievement } from "../../questStructure.js";
import { InputPlus, TextAreaPlus } from "../functions.js";

export class Editor_Achievements
{
	private container = Div();
	constructor(private achievements: Achievement[], private save: () => void) { }
	public render(body: HTMLElement)
	{
		body.innerHTML = "";
		this.container = Div();
		body.appendChild(Div([], [
			Div("pg2-line", [
				this.container,
			]),
			Div(["pg2-line", "ta-center"], [
				Button([], "Добавить достижение", this.addItem.bind(this)),
			]),
		]));
		this.createItems();
	}
	private createItems()
	{
		for (let i = 0; i < this.achievements.length; i++) {
			const ch = this.achievements[i];
			new Editor_Achievement(this.achievements, ch, this.save).render(this.container);
		}
	}
	private addItem()
	{
		const item = this.createItem();
		this.achievements.push(item);
		new Editor_Achievement(this.achievements, item, this.save).render(this.container);
	}
	private createItem()
	{
		return <Achievement>{
			id: this.nextId(),
			name: "",
			description: "",
		}
	}
	private nextId()
	{
		if (this.achievements.length <= 0) return "0";
		const num = parseInt(this.achievements[this.achievements.length - 1].id);
		if (isNaN(num)) return Date.now().toString();
		return `${num + 1}`;
	}
}

class Editor_Achievement
{
	private div = Div();
	constructor(private achievements: Achievement[], private achievement: Achievement, private save: () => void) { }
	public render(body: HTMLElement)
	{
		this.div = Div("pg2-block", [
			Div("pg2-line", [
				InputPlus(["pg2", "ta-center"], "text", "Название достижения")(
					inp => { this.achievement.name = inp.value; this.save(); },
					inp => inp.value = this.achievement.name)(),
			]),
			Div("pg2-line", [
				Div([], [], "Описание достижения:"),
				TextAreaPlus("Описание достижения", "pg2")(
					inp => { this.achievement.description = inp.value; this.save(); },
					inp => inp.value = this.achievement.description)(),
			]),
			Div(["pg2-line", "ta-end"], [
				Button([], "Удалить", this.deleteThis.bind(this, body)),
			]),
		]);
		body.appendChild(this.div);
	}
	private deleteThis(body: HTMLElement)
	{
		const i = this.achievements.indexOf(this.achievement);
		if (i >= 0) this.achievements.splice(i, 1);
		body.removeChild(this.div);
		this.save();
	}
}