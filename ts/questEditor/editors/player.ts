import { Button, Div } from "../../functions.js";
import { Characteristic } from "../../questStructure.js";
import { CheckBox, InputPlus, QuestFull, TextAreaPlus } from "../functions.js";

export class Editor_Player
{
	private container_items = Div();
	private container_charac = Div();
	private selected_item = document.createElement("select");
	constructor(private quest: QuestFull, private save: () => void) { }
	public render(body: HTMLElement)
	{
		this.container_items = Div();
		this.container_charac = Div();
		this.selected_item = this.createSelectItem();
		body.innerHTML = "";
		body.appendChild(Div([], [
			Div("pg2-line", [
				Div([], [], "Предметы игрока:"),
			]),
			Div("pg2-line", [
				this.container_items,
			]),
			Div("pg2-line", [
				this.selected_item,
				Button([], "Добавить предмет", this.addItem.bind(this)),
			]),
			Div("pg2-line", [
				Div([], [], "Характеристики игрока:"),
			]),
			Div("pg2-line", [
				this.container_charac,
			]),
			Div("pg2-line", [
				Button([], "Добавить характеристику", this.addCharac.bind(this)),
			]),
		]));
		this.createItems();
		this.createCharacs();
	}
	private createItems()
	{
		for (let i = this.quest.player.items.length - 1; i >= 0; i--) {
			const itemId = this.quest.player.items[i];
			const item = this.quest.items.find(it => it.id == itemId);
			if (item) this.createItem(item.name, itemId);
			else this.quest.player.items.splice(i, 1);
		}
	}
	private createSelectItem()
	{
		const select = document.createElement("select");
		const option = document.createElement("option");
		option.value = "";
		option.innerText = "Выберите предмет";
		select.appendChild(option);
		this.quest.items.forEach(item => {
			const option = document.createElement("option");
			option.value = item.id;
			option.innerText = item.name;
			select.appendChild(option);
		});
		return select;
	}
	private addItem()
	{
		if (typeof this.selected_item.value != "string" || this.selected_item.value == "") return;
		this.createItem(this.selected_item.selectedOptions[0].innerText, this.selected_item.value);
		this.quest.player.items.push(this.selected_item.value);
		this.selected_item.value = "";
		this.save();
	}
	private createItem(text: string, id: string)
	{
		const div = Div(["pg2-line", "pg2-itemline"], [
			Div([], [], text),
			Button([], "Удалить", () =>
			{
				const i = this.quest.player.items.indexOf(id);
				if (i >= 0) this.quest.player.items.splice(i, 1);
				this.container_items.removeChild(div);
				this.save();
			}),
		]);
		this.container_items.appendChild(div);
	}

	private createCharacs()
	{
		for (let i = 0; i < this.quest.player.characteristics.length; i++) {
			const ch = this.quest.player.characteristics[i];
			new Editor_Charac(this.quest.player.characteristics, ch, this.save).render(this.container_charac);
		}
	}
	private addCharac()
	{
		const item = this.createCharac();
		this.quest.player.characteristics.push(item);
		new Editor_Charac(this.quest.player.characteristics, item, this.save).render(this.container_charac);
	}
	private createCharac()
	{
		return <Characteristic>{
			id: this.nextId(),
			name: "",
			description: "",
			value: 0,
			hidden: false,
			loseIfBelowZero: false,
			hasLoseImg: false,
			loseText: "",
		}
	}
	private nextId()
	{
		if (this.quest.player.characteristics.length <= 0) return "0";
		const num = parseInt(this.quest.player.characteristics[this.quest.player.characteristics.length - 1].id);
		if (isNaN(num)) return Date.now().toString();
		return `${num + 1}`;
	}
}

class Editor_Charac
{
	private div = Div();
	constructor(private charas: Characteristic[], private charac: Characteristic, private save: () => void) { }
	public render(body: HTMLElement)
	{
		const part2 = Div([], [
			Div("pg2-line", [
				Div([], [], "Текст при проигрыше:"),
				InputPlus("pg2", "text", "Текст при проигрыше")(
					inp => { this.charac.loseText = inp.value; this.save(); },
					inp => inp.value = this.charac.loseText)(),
			]),
		]);
		part2.style.display = this.charac.loseIfBelowZero ? "" : "none";
		const part = Div([], [
			Div("pg2-line", [
				CheckBox([], "Если меньше нуля, то игрок проиграет")(
					inp =>
					{
						this.charac.loseIfBelowZero = inp.checked;
						this.save();
						part2.style.display = inp.checked ? "" : "none";
					},
					inp => inp.checked = this.charac.loseIfBelowZero)(),
			]),
			part2,
		]);
		part.style.display = this.charac.hidden ? "none" : "";
		this.div = Div("pg2-block", [
			Div("pg2-line", [
				InputPlus(["pg2", "ta-center"], "text", "Имя характеристики")(
					inp => { this.charac.name = inp.value; this.save(); },
					inp => inp.value = this.charac.name)(),
			]),
			Div("pg2-line", [
				Div([], [], "Описание характеристики:"),
				TextAreaPlus("Описание характеристики", "pg2")(
					inp => { this.charac.description = inp.value; this.save(); },
					inp => inp.value = this.charac.description)(),
			]),
			Div("pg2-line", [
				Div([], [], "Значение характеристики:"),
				InputPlus("pg2", "number", "Значение характеристики")(
					inp => { this.charac.value = inp.valueAsNumber; this.save(); },
					inp => inp.valueAsNumber = this.charac.value)(),
			]),
			Div("pg2-line", [
				CheckBox([], "Скрытая характеристика")(
					inp =>
					{
						this.charac.hidden = inp.checked;
						this.save();
						part.style.display = inp.checked ? "none" : "";
					},
					inp => inp.checked = this.charac.hidden)(),
			]),
			part,
			Div(["pg2-line", "ta-end"], [
				Button([], "Удалить", this.deleteThis.bind(this, body)),
			]),
		]);
		body.appendChild(this.div);
	}
	private deleteThis(body: HTMLElement)
	{
		const i = this.charas.indexOf(this.charac);
		if (i >= 0) this.charas.splice(i, 1);
		body.removeChild(this.div);
		this.save();
	}
}