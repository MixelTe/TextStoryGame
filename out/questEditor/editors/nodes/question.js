import { Button, Div, Option, Select, SelectPlus, Span } from "../../../functions.js";
import { CheckBox, TextAreaPlus } from "../../functions.js";
import { Editor_Options } from "../../options.js";
import { Editor_condition } from "./condition.js";
import { Editor_Node } from "./node.js";
export class Editor_Node_question extends Editor_Node {
    constructor(quest, node, chapter) {
        super(quest, chapter);
        this.node = node;
    }
    render(collapsed = true) {
        const deletedChar = this.node.character != "" && this.node.character != "author" && this.quest.characters.find(ch => ch.id == this.node.character) == undefined;
        const emotionsContainer = Div("pg2-line-small");
        const actionsContainer = Div("pg2-line-small");
        const text1 = Span();
        const text2 = Span();
        const content = Div([], [
            Div("pg2-line-small", [
                Span("margin-right", [], "Говорящий:"),
                SelectPlus(add => {
                    if (deletedChar)
                        add("Удалённый персонаж", "deleted", "color-error");
                    add("Автор", "author");
                    for (let i = 0; i < this.quest.characters.length; i++) {
                        const ch = this.quest.characters[i];
                        add(ch.name, ch.id);
                    }
                }, select => {
                    if (select.value != "deleted") {
                        select.classList.remove("color-error");
                        if (deletedChar && select.firstChild)
                            select.removeChild(select.firstChild);
                        if (select.value != "") {
                            this.node.character = select.value;
                            text1.innerText = "?: " + select.selectedOptions[0].innerText + ": ";
                            this.chapter.save();
                        }
                    }
                    if (select.value == "author")
                        emotionsContainer.style.display = "none";
                    else
                        emotionsContainer.style.display = "";
                }, select => {
                    if (deletedChar) {
                        select.value = "deleted";
                        select.classList.add("color-error");
                    }
                    else {
                        select.value = this.node.character;
                        text1.innerText = "?: " + select.selectedOptions[0].innerText + ": ";
                    }
                    if (select.value == "author")
                        emotionsContainer.style.display = "none";
                }),
            ]),
            emotionsContainer,
            Div("pg2-line-small", [
                TextAreaPlus("Текст/речь", [])(inp => { this.node.text = inp.value; this.chapter.save(); text2.innerText = this.node.text; }, inp => { inp.value = this.node.text; text2.innerText = this.node.text; })(),
            ]),
            Div("pg2-line-small", [
                Span([], [], "Варианты ответов/действий:"),
            ]),
            actionsContainer,
            Div("pg2-line-small", [
                Button([], "Добавить", () => {
                    const action = this.createAction();
                    this.node.actions.push(action);
                    this.addAction(action, actionsContainer, false);
                }),
            ]),
        ]);
        this.createActions(actionsContainer);
        if (Editor_Options.EnableEmotionSelect) {
            emotionsContainer.appendChild(Span("margin-right", [], "Эмоция:"));
            emotionsContainer.appendChild(Select([], [
                Option("Спокойствие", "normal"),
                Option("Грусть", "sad"),
                Option("Злость", "angry"),
                Option("Счастье", "happy"),
            ], select => { this.node.characterImg = select.value; this.chapter.save(); }, select => { select.value = this.node.characterImg; }));
        }
        return this.create(content, [text1, text2], collapsed);
    }
    createActions(actionsContainer) {
        for (let i = 0; i < this.node.actions.length; i++) {
            this.addAction(this.node.actions[i], actionsContainer);
        }
    }
    addAction(action, actionsContainer, collapsed = true) {
        const header = Div("pg2-block-header");
        const condEl = Div("pg2-line-small", [
            Button([], "Редактировать", async () => {
                if (!action.conditions)
                    action.conditions = Editor_condition.createNode();
                await new Editor_condition(this.quest, action.conditions).open();
                this.chapter.save();
            }),
        ]);
        let cond = undefined;
        const condShowEl = Div("pg2-line-small", [
            Button([], "Редактировать", async () => {
                if (!action.showConditions)
                    action.showConditions = Editor_condition.createNode();
                await new Editor_condition(this.quest, action.showConditions).open();
                this.chapter.save();
            }),
        ]);
        let condShow = undefined;
        const partEl = Div("pg2-line-small", [
            Button([], "Редактировать", () => {
                action.partId = this.chapter.openNewPartEditor(action.partId || "");
            }),
        ]);
        const partNotEmpty = this.chapter.hasPartContent(action.partId);
        partEl.style.display = partNotEmpty ? "" : "none";
        const content = Div([], [
            Div("pg2-line-small", [
                TextAreaPlus("Ответ/действие", [])(inp => { action.text = inp.value; this.chapter.save(); header.innerText = action.text; }, inp => { inp.value = action.text; header.innerText = action.text; })(),
            ]),
            Div("pg2-line-small", [
                CheckBox([], "Можно выбрать только при условии")(inp => {
                    condEl.style.display = inp.checked ? "" : "none";
                    [cond, action.conditions] = [action.conditions, cond];
                    this.chapter.save();
                }, inp => {
                    inp.checked = action.conditions != undefined;
                    condEl.style.display = inp.checked ? "" : "none";
                    if (!inp.checked)
                        [cond, action.conditions] = [action.conditions, cond];
                })(),
            ]),
            condEl,
            Div("pg2-line-small", [
                CheckBox([], "Будет показано только при условии")(inp => {
                    condShowEl.style.display = inp.checked ? "" : "none";
                    [condShow, action.showConditions] = [action.showConditions, condShow];
                    this.chapter.save();
                }, inp => {
                    inp.checked = action.showConditions != undefined;
                    condShowEl.style.display = inp.checked ? "" : "none";
                    if (!inp.checked)
                        [condShow, action.showConditions] = [action.showConditions, condShow];
                })(),
            ]),
            condShowEl,
            Div("pg2-line-small", [
                CheckBox([], "Действия при выборе этого варианта")(inp => {
                    partEl.style.display = inp.checked ? "" : "none";
                }, inp => {
                    inp.checked = partNotEmpty;
                    if (partNotEmpty)
                        inp.disabled = true;
                })(),
            ]),
            partEl,
        ]);
        const block = Div(["pg2-block-small", "pg2-collapsible"], [
            Button("pg2-block-collapse", collapsed ? "+" : "-", btn => {
                collapsed = !collapsed;
                btn.innerText = collapsed ? "+" : "-";
                block.classList.toggle("pg2-collapsed", collapsed);
            }),
            Button("pg2-block-contextmenu", "x", () => {
                const i = this.node.actions.indexOf(action);
                if (i >= 0)
                    this.node.actions.splice(i, 1);
                actionsContainer.removeChild(block);
            }),
            header,
            content,
        ]);
        block.classList.toggle("pg2-collapsed", collapsed);
        actionsContainer.appendChild(block);
    }
    createAction() {
        const action = {
            text: "",
        };
        return action;
    }
    static createNode() {
        const node = {
            type: "question",
            character: "author",
            characterImg: "normal",
            text: "",
            actions: []
        };
        return node;
    }
}
