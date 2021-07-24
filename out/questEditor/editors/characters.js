import { Button, Div } from "../../functions.js";
import { InputPlus, TextAreaPlus } from "../functions.js";
export class Editor_Characters {
    constructor(characters, save) {
        this.characters = characters;
        this.save = save;
        this.container = Div();
    }
    render(body) {
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
    createCharacters() {
        for (let i = 0; i < this.characters.length; i++) {
            const ch = this.characters[i];
            new Editor_Character(this.characters, ch, this.save).render(this.container);
        }
    }
    addCharacter() {
        const ch = this.createCharacter();
        this.characters.push(ch);
        new Editor_Character(this.characters, ch, this.save).render(this.container);
    }
    createCharacter() {
        return {
            id: this.nextId(),
            name: "",
            description: "",
            friendLevel: 0,
        };
    }
    nextId() {
        if (this.characters.length <= 0)
            return "0";
        const num = parseInt(this.characters[this.characters.length - 1].id);
        if (isNaN(num))
            return Date.now().toString();
        return `${num + 1}`;
    }
}
class Editor_Character {
    constructor(characters, character, save) {
        this.characters = characters;
        this.character = character;
        this.save = save;
        this.div = Div();
    }
    render(body) {
        this.div = Div("pg2-block", [
            Div("pg2-line", [
                InputPlus(["pg2", "ta-center"], "text", "Имя персонажа")(inp => { this.character.name = inp.value; this.save(); }, inp => inp.value = this.character.name)(),
            ]),
            Div("pg2-line", [
                Div([], [], "Описание персонажа:"),
                TextAreaPlus("Описание персонажа", "pg2")(inp => { this.character.description = inp.value; this.save(); }, inp => inp.value = this.character.description)(),
            ]),
            Div("pg2-line", [
                Div([], [], "Уровень дружбы с персонажем:"),
                InputPlus("pg2", "number", "Уровень дружбы с персонажем")(inp => { this.character.friendLevel = inp.valueAsNumber; this.save(); }, inp => inp.valueAsNumber = this.character.friendLevel)(),
            ]),
            Div(["pg2-line", "ta-end"], [
                Button([], "Удалить", this.deleteThis.bind(this, body)),
            ]),
        ]);
        body.appendChild(this.div);
    }
    deleteThis(body) {
        const i = this.characters.indexOf(this.character);
        if (i >= 0)
            this.characters.splice(i, 1);
        body.removeChild(this.div);
        this.save();
    }
}
