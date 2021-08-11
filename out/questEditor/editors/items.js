import { Button, confirm_Popup, Div } from "../../functions.js";
import { InputPlus, TextAreaPlus } from "../functions.js";
export class Editor_Items {
    constructor(items, save) {
        this.items = items;
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
                Button([], "Добавить предмет", this.addItem.bind(this)),
            ]),
        ]));
        this.createItems();
    }
    createItems() {
        for (let i = 0; i < this.items.length; i++) {
            const ch = this.items[i];
            new Editor_Item(this.items, ch, this.save).render(this.container);
        }
    }
    addItem() {
        const item = this.createItem();
        this.items.push(item);
        new Editor_Item(this.items, item, this.save).render(this.container);
    }
    createItem() {
        return {
            id: this.nextId(),
            name: "",
            description: "",
            friendLevel: 0,
            hasImg: false,
        };
    }
    nextId() {
        if (this.items.length <= 0)
            return "0";
        const num = parseInt(this.items[this.items.length - 1].id);
        if (isNaN(num))
            return Date.now().toString();
        return `${num + 1}`;
    }
}
class Editor_Item {
    constructor(characters, item, save) {
        this.characters = characters;
        this.item = item;
        this.save = save;
        this.div = Div();
    }
    render(body) {
        this.div = Div("pg2-block", [
            Div("pg2-line", [
                InputPlus(["pg2", "ta-center"], "text", "Название предмета")(inp => { this.item.name = inp.value; this.save(); }, inp => inp.value = this.item.name)(),
            ]),
            Div("pg2-line", [
                Div([], [], "Описание предмета:"),
                TextAreaPlus("Описание предмета", "pg2")(inp => { this.item.description = inp.value; this.save(); }, inp => inp.value = this.item.description)(),
            ]),
            Div(["pg2-line", "ta-end"], [
                Button("pg2-btn-delete", "X", this.deleteThis.bind(this, body)),
            ]),
        ]);
        body.appendChild(this.div);
    }
    async deleteThis(body) {
        if (!await confirm_Popup(`предмет ${this.item.name}?`))
            return;
        const i = this.characters.indexOf(this.item);
        if (i >= 0)
            this.characters.splice(i, 1);
        body.removeChild(this.div);
        this.save();
    }
}
