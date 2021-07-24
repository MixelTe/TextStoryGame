import { Div } from "../../functions.js";
import { InputPlus, TextAreaPlus } from "../functions.js";
export class Editor_Quest {
    constructor(quest, save) {
        this.quest = quest;
        this.save = save;
    }
    render(body) {
        body.innerHTML = "";
        body.appendChild(Div([], [
            Div("pg2-line", [
                Div([], [], "Название:"),
                InputPlus("pg2", "text", "Название квеста")(inp => { this.quest.name = inp.value; this.save(); }, inp => inp.value = this.quest.name)(),
            ]),
            Div("pg2-line", [
                Div([], [], "Описание:"),
                TextAreaPlus("Описание квеста", "pg2")(ta => { this.quest.description = ta.value; this.save(); }, ta => ta.value = this.quest.description)(),
            ]),
        ]));
    }
}
