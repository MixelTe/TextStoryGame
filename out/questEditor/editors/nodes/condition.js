import { Button, Div, Input, Span } from "../../../functions.js";
import { Popup } from "../../../popup.js";
import { CheckBox } from "../../functions.js";
import { createItems, createSelectCharacteristic, itemAdder } from "../nodeTools.js";
export class Editor_condition {
    constructor(quest, condition) {
        this.quest = quest;
        this.condition = condition;
        this.popup = new Popup();
        this.items = false;
        this.itemsNot = false;
        this.charac = false;
    }
    render(body) {
        const itemContainer = createItems(this.quest, this.condition.items);
        const items = Div([], [
            itemContainer,
            itemAdder(this.quest, itemContainer, this.condition.items),
        ]);
        const itemNotContainer = createItems(this.quest, this.condition.itemsNot);
        const itemsNot = Div([], [
            itemNotContainer,
            itemAdder(this.quest, itemNotContainer, this.condition.itemsNot),
        ]);
        const characContainer = this.createCharacs();
        const charac = Div([], [
            characContainer,
            this.characAdder(characContainer),
        ]);
        body.appendChild(Div([], [
            Div("pg2-line-small", [
                CheckBox([], "Присутствие предметов у игрока")(inp => {
                    items.style.display = inp.checked ? "" : "none";
                    this.items = inp.checked;
                }, inp => {
                    this.items = this.condition.items.length != 0;
                    inp.checked = this.items;
                    items.style.display = this.items ? "" : "none";
                })(),
            ]),
            items,
            Div("pg2-line-small", [
                CheckBox([], "Отсутствие предметов у игрока")(inp => {
                    itemsNot.style.display = inp.checked ? "" : "none";
                    this.itemsNot = inp.checked;
                }, inp => {
                    this.itemsNot = this.condition.itemsNot.length != 0;
                    inp.checked = this.itemsNot;
                    itemsNot.style.display = this.itemsNot ? "" : "none";
                })(),
            ]),
            itemsNot,
            Div("pg2-line-small", [
                CheckBox([], "Значение характеритик")(inp => {
                    charac.style.display = inp.checked ? "" : "none";
                    this.charac = inp.checked;
                }, inp => {
                    this.charac = this.condition.characteristics.length != 0;
                    inp.checked = this.charac;
                    charac.style.display = this.charac ? "" : "none";
                })(),
            ]),
            charac,
        ]));
    }
    save() {
        if (!this.items)
            this.condition.items = [];
        if (!this.itemsNot)
            this.condition.itemsNot = [];
        if (!this.charac)
            this.condition.characteristics = [];
        else {
            for (let i = this.condition.characteristics.length - 1; i >= 0; i--) {
                const ch = this.condition.characteristics[i];
                if (isNaN(ch.lessThen ?? NaN))
                    ch.lessThen = undefined;
                if (isNaN(ch.moreThen ?? NaN))
                    ch.moreThen = undefined;
                if (ch.id == "" || (ch.lessThen == undefined && ch.moreThen == undefined)) {
                    this.condition.characteristics.splice(i, 1);
                }
            }
        }
    }
    createCharacs() {
        const container = Div("pg2-line-small", []);
        for (let i = 0; i < this.condition.characteristics.length; i++) {
            container.appendChild(this.createCharac(i));
        }
        return container;
    }
    createCharac(i, collapsed = true) {
        const text1 = Span();
        const text2 = Span();
        const text3 = Span();
        const ch = this.condition.characteristics[i];
        const select = createSelectCharacteristic(this.quest);
        select.value = ch.id;
        select.addEventListener("change", () => {
            ch.id = select.value;
            text2.innerText = select.selectedOptions[0].innerText;
        });
        const lessInput = Input("margin-left", "number");
        lessInput.valueAsNumber = ch.lessThen || 0;
        lessInput.addEventListener("input", () => { ch.lessThen = lessInput.valueAsNumber; text3.innerText = ` < ${ch.lessThen}`; });
        const moreInput = Input("margin-left", "number");
        moreInput.valueAsNumber = ch.moreThen || 0;
        moreInput.addEventListener("input", () => { ch.moreThen = moreInput.valueAsNumber; text1.innerText = `${ch.moreThen} <`; });
        const content = Div([], [
            Div("pg2-line-small", [
                select,
            ]),
            Div("pg2-line-small", [
                CheckBox([], "Меньше чем", true)(inp => {
                    lessInput.style.display = inp.checked ? "" : "none";
                    ch.lessThen = inp.checked ? lessInput.valueAsNumber : NaN;
                    text3.innerText = inp.checked ? ` < ${ch.lessThen}` : "";
                }, inp => {
                    inp.checked = ch.lessThen != undefined;
                    lessInput.style.display = inp.checked ? "" : "none";
                    text3.innerText = inp.checked ? ` < ${ch.lessThen}` : "";
                })(),
                lessInput,
            ]),
            Div("pg2-line-small", [
                CheckBox([], "Больше чем", true)(inp => {
                    moreInput.style.display = inp.checked ? "" : "none";
                    ch.moreThen = inp.checked ? moreInput.valueAsNumber : NaN;
                    text1.innerText = inp.checked ? `${ch.moreThen} < ` : "";
                }, inp => {
                    inp.checked = ch.moreThen != undefined;
                    moreInput.style.display = inp.checked ? "" : "none";
                    text1.innerText = inp.checked ? `${ch.moreThen} < ` : "";
                })(),
                moreInput,
            ]),
        ]);
        text2.innerText = select.selectedOptions[0].innerText;
        const block = Div(["pg2-block-small", "pg2-collapsible"], [
            Button("pg2-block-collapse", collapsed ? "+" : "-", btn => {
                collapsed = !collapsed;
                btn.innerText = collapsed ? "+" : "-";
                block.classList.toggle("pg2-collapsed", collapsed);
            }),
            Button("pg2-block-contextmenu", "x", () => {
                const i = this.condition.characteristics.indexOf(ch);
                if (i >= 0)
                    this.condition.characteristics.splice(i, 1);
                block.parentElement?.removeChild(block);
            }),
            Div("pg2-block-header", [text1, text2, text3]),
            content,
        ]);
        block.classList.toggle("pg2-collapsed", collapsed);
        return block;
    }
    characAdder(container) {
        const line = Div("pg2-line-small", [
            Button([], "Добавить", () => {
                this.condition.characteristics.push({ id: "" });
                const el = this.createCharac(this.condition.characteristics.length - 1, false);
                container.appendChild(el);
            }),
        ]);
        return line;
    }
    async open() {
        return new Promise((resolve) => {
            this.popup = new Popup();
            this.popup.title = "Условие";
            this.popup.okBtn = false;
            this.popup.cancelBtn = false;
            this.render(this.popup.content);
            this.popup.addListener("close", () => {
                this.save();
                resolve();
            });
            this.popup.open();
        });
    }
    static createNode() {
        const node = {
            characteristics: [],
            items: [],
            itemsNot: [],
            partsDone: [],
            partsNotDone: [],
        };
        return node;
    }
}
