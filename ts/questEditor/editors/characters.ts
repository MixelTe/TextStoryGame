import { Button, confirm_Popup, Div } from "../../functions.js";
import { Character } from "../../questStructure.js";
import { InputPlus, TextAreaPlus } from "../functions.js";

export class Editor_Characters
{
	private container = Div();
	constructor(private characters: Character[], private save: () => void) { }
	public render(body: HTMLElement)
	{
		body.innerHTML = "";
		this.container = Div();
		body.appendChild(Div([], [
			Div("pg2-line", [
				this.container,
			]),
			Div(["pg2-line", "ta-center"], [
				Button([], "Добавить персонажа", this.addCharacter.bind(this)),
			]),
		]));
		this.createCharacters();
	}
	private createCharacters()
	{
		for (let i = 0; i < this.characters.length; i++) {
			const ch = this.characters[i];
			new Editor_Character(this.characters, ch, this.save).render(this.container);
		}
	}
	private addCharacter()
	{
		const ch = this.createCharacter();
		this.characters.push(ch);
		new Editor_Character(this.characters, ch, this.save).render(this.container);
	}
	private createCharacter()
	{
		return <Character>{
			id: this.nextId(),
			name: "",
			description: "",
			friendLevel: 0,
			hasImg: false,
		}
	}
	private nextId()
	{
		if (this.characters.length <= 0) return "cr0";
		const num = parseInt(this.characters[this.characters.length - 1].id.slice(2));
		if (isNaN(num)) return "cr" + Date.now().toString();
		return `cr${num + 1}`;
	}
}

class Editor_Character
{
	private div = Div();
	constructor(private characters: Character[], private character: Character, private save: () => void) { }
	public render(body: HTMLElement)
	{
		this.div = Div("pg2-block", [
			Div("pg2-line", [
				InputPlus(["pg2", "ta-center"], "text", "Имя персонажа")(
					inp => { this.character.name = inp.value; this.save(); },
					inp => inp.value = this.character.name)(),
			]),
			Div("pg2-line", [
				Div([], [], "Описание персонажа:"),
				TextAreaPlus("Описание персонажа", "pg2")(
					inp => { this.character.description = inp.value; this.save(); },
					inp => inp.value = this.character.description)(),
			]),
			Div("pg2-line", [
				Div([], [], "Уровень дружбы с персонажем:"),
				InputPlus("pg2", "number", "Уровень дружбы с персонажем")(
					inp => { this.character.friendLevel = inp.valueAsNumber; this.save(); },
					inp => inp.valueAsNumber = this.character.friendLevel)(),
			]),
			Div(["pg2-line", "ta-end"], [
				Button("pg2-btn-delete", "X", this.deleteThis.bind(this, body)),
			]),
		]);
		body.appendChild(this.div);
	}
	private async deleteThis(body: HTMLElement)
	{
		if (!await confirm_Popup(`персонажа ${this.character.name}?`)) return;
		const i = this.characters.indexOf(this.character);
		if (i >= 0) this.characters.splice(i, 1);
		body.removeChild(this.div);
		this.save();
	}
}