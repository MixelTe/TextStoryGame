import { Button, confirm_Popup, Div } from "../../functions.js";
import { InputPlus, TextAreaPlus } from "../functions.js";
export class Editor_Achievements {
    constructor(achievements, save) {
        this.achievements = achievements;
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
                Button([], "Добавить достижение", this.addItem.bind(this)),
            ]),
        ]));
        this.createItems();
    }
    createItems() {
        for (let i = 0; i < this.achievements.length; i++) {
            const ch = this.achievements[i];
            new Editor_Achievement(this.achievements, ch, this.save).render(this.container);
        }
    }
    addItem() {
        const item = this.createItem();
        this.achievements.push(item);
        new Editor_Achievement(this.achievements, item, this.save).render(this.container);
    }
    createItem() {
        return {
            id: this.nextId(),
            name: "",
            description: "",
        };
    }
    nextId() {
        if (this.achievements.length <= 0)
            return "0";
        const num = parseInt(this.achievements[this.achievements.length - 1].id);
        if (isNaN(num))
            return Date.now().toString();
        return `${num + 1}`;
    }
}
class Editor_Achievement {
    constructor(achievements, achievement, save) {
        this.achievements = achievements;
        this.achievement = achievement;
        this.save = save;
        this.div = Div();
    }
    render(body) {
        this.div = Div("pg2-block", [
            Div("pg2-line", [
                InputPlus(["pg2", "ta-center"], "text", "Название достижения")(inp => { this.achievement.name = inp.value; this.save(); }, inp => inp.value = this.achievement.name)(),
            ]),
            Div("pg2-line", [
                Div([], [], "Описание достижения:"),
                TextAreaPlus("Описание достижения", "pg2")(inp => { this.achievement.description = inp.value; this.save(); }, inp => inp.value = this.achievement.description)(),
            ]),
            Div(["pg2-line", "ta-end"], [
                Button("pg2-btn-delete", "X", this.deleteThis.bind(this, body)),
            ]),
        ]);
        body.appendChild(this.div);
    }
    async deleteThis(body) {
        if (!await confirm_Popup(`предмет ${this.achievement.name}?`))
            return;
        const i = this.achievements.indexOf(this.achievement);
        if (i >= 0)
            this.achievements.splice(i, 1);
        body.removeChild(this.div);
        this.save();
    }
}
