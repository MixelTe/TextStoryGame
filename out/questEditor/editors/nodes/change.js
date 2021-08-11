import { Button, Div, Input, Span } from "../../../functions.js";
import { CheckBox } from "../../functions.js";
import { achievementsAdder, createAchievements, createItems, createSelectCharacteristic, itemAdder } from "../nodeTools.js";
import { Editor_Node } from "./node.js";
export class Editor_Node_change extends Editor_Node {
    constructor(quest, node, chapter) {
        super(quest, chapter);
        this.node = node;
    }
    render(collapsed = true) {
        const save = () => this.chapter.save();
        const text1 = Span();
        const text2 = Span();
        const text3 = Span();
        const text4 = Span();
        const addItemsContainer = createItems(this.quest, this.node.addItems, save);
        let addItems = [];
        const addItemsEl = Div([], [
            addItemsContainer,
            itemAdder(this.quest, addItemsContainer, this.node.addItems, save),
        ]);
        const removeItemsContainer = createItems(this.quest, this.node.removeItems, save);
        let removeItems = [];
        const removeItemsEl = Div([], [
            removeItemsContainer,
            itemAdder(this.quest, removeItemsContainer, this.node.removeItems, save),
        ]);
        const achievementsContainer = createAchievements(this.quest, this.node.achievements, save);
        let achievements = [];
        const achievementsEl = Div([], [
            achievementsContainer,
            achievementsAdder(this.quest, achievementsContainer, this.node.achievements, () => save, true, v => !this.node.achievements.includes(v)),
        ]);
        const characsContainer = this.createCharacs();
        let characs = [];
        const characsEl = Div([], [
            characsContainer,
            this.characAdder(characsContainer),
        ]);
        const content = Div([], [
            Div("pg2-line-small", [
                CheckBox([], "Дать предметы игроку")(inp => {
                    addItemsEl.style.display = inp.checked ? "" : "none";
                    [addItems, this.node.addItems] = [this.node.addItems, addItems];
                    save();
                    text1.innerText = inp.checked ? "+Предметы " : "";
                }, inp => {
                    inp.checked = this.node.addItems.length != 0;
                    addItemsEl.style.display = inp.checked ? "" : "none";
                    if (!inp.checked)
                        [addItems, this.node.addItems] = [this.node.addItems, addItems];
                    text1.innerText = inp.checked ? "+Предметы " : "";
                })(),
            ]),
            addItemsEl,
            Div("pg2-line-small", [
                CheckBox([], "Забрать предметы у игрока")(inp => {
                    removeItemsEl.style.display = inp.checked ? "" : "none";
                    [removeItems, this.node.removeItems] = [this.node.removeItems, removeItems];
                    save();
                    text2.innerText = inp.checked ? "-Предметы " : "";
                }, inp => {
                    inp.checked = this.node.removeItems.length != 0;
                    removeItemsEl.style.display = inp.checked ? "" : "none";
                    if (!inp.checked)
                        [removeItems, this.node.removeItems] = [this.node.removeItems, removeItems];
                    text2.innerText = inp.checked ? "-Предметы " : "";
                })(),
            ]),
            removeItemsEl,
            Div("pg2-line-small", [
                CheckBox([], "Выдать игроку достижение")(inp => {
                    achievementsEl.style.display = inp.checked ? "" : "none";
                    [achievements, this.node.achievements] = [this.node.achievements, achievements];
                    save();
                    text3.innerText = inp.checked ? "+Достижения " : "";
                }, inp => {
                    inp.checked = this.node.achievements.length != 0;
                    achievementsEl.style.display = inp.checked ? "" : "none";
                    if (!inp.checked)
                        [achievements, this.node.achievements] = [this.node.achievements, achievements];
                    text3.innerText = inp.checked ? "+Достижения " : "";
                })(),
            ]),
            achievementsEl,
            Div("pg2-line-small", [
                CheckBox([], "Изменить характеристики")(inp => {
                    characsEl.style.display = inp.checked ? "" : "none";
                    [characs, this.node.characteristics] = [this.node.characteristics, characs];
                    save();
                    text4.innerText = inp.checked ? "~Характеристики " : "";
                }, inp => {
                    inp.checked = this.node.characteristics.length != 0;
                    characsEl.style.display = inp.checked ? "" : "none";
                    if (!inp.checked)
                        [characs, this.node.characteristics] = [this.node.characteristics, characs];
                    text4.innerText = inp.checked ? "~Характеристики " : "";
                })(),
            ]),
            characsEl,
        ]);
        return this.create(content, [Span([], [], "Изменения: "), text1, text2, text3, text4], collapsed);
    }
    createCharacs() {
        const container = Div("pg2-line-small", []);
        for (let i = 0; i < this.node.characteristics.length; i++) {
            container.appendChild(this.createCharac(i));
        }
        return container;
    }
    createCharac(i, collapsed = true) {
        const D = (num) => {
            if (num >= 0)
                return ` +${num}`;
            return ` ${num}`;
        };
        const text1 = Span();
        const text2 = Span();
        const header = Div("pg2-block-header", [text1, text2]);
        const ch = this.node.characteristics[i];
        const select = createSelectCharacteristic(this.quest);
        select.value = ch.id;
        select.addEventListener("change", () => {
            ch.id = select.value;
            text1.innerText = select.selectedOptions[0].innerText;
            this.chapter.save();
        });
        const toInput = Input("margin-left", "number");
        toInput.valueAsNumber = ch.to || 0;
        toInput.addEventListener("input", () => { ch.to = toInput.valueAsNumber; this.chapter.save(); text2.innerText = `: ${toInput.valueAsNumber}`; });
        const byInput = Input("margin-left", "number");
        byInput.valueAsNumber = ch.by || 0;
        byInput.addEventListener("input", () => { ch.by = byInput.valueAsNumber; this.chapter.save(); text2.innerText = D(byInput.valueAsNumber); });
        const name = "changeCharac" + Math.random().toString().slice(2);
        const content = Div([], [
            Div("pg2-line-small", [
                select,
            ]),
            Div("pg2-line-small", [
                Span([], [], "Изменить"),
            ]),
            Div("pg2-line-small", [
                CheckBox([], "на", true)(inp => {
                    byInput.style.display = inp.checked ? "" : "none";
                    ch.by = inp.checked ? byInput.valueAsNumber : undefined;
                    toInput.style.display = inp.checked ? "none" : "";
                    ch.to = inp.checked ? undefined : toInput.valueAsNumber;
                    text2.innerText = inp.checked ? D(byInput.valueAsNumber) : `: ${toInput.valueAsNumber}`;
                    this.chapter.save();
                }, inp => {
                    inp.checked = ch.by != undefined;
                    byInput.style.display = inp.checked ? "" : "none";
                    inp.type = "radio";
                    inp.name = name;
                    text2.innerText = inp.checked ? D(byInput.valueAsNumber) : `: ${toInput.valueAsNumber}`;
                })(),
                byInput,
            ]),
            Div("pg2-line-small", [
                CheckBox([], "в", true)(inp => {
                    toInput.style.display = inp.checked ? "" : "none";
                    ch.to = inp.checked ? toInput.valueAsNumber : undefined;
                    byInput.style.display = inp.checked ? "none" : "";
                    ch.by = inp.checked ? undefined : byInput.valueAsNumber;
                    text2.innerText = inp.checked ? `: ${toInput.valueAsNumber}` : D(byInput.valueAsNumber);
                    this.chapter.save();
                }, inp => {
                    inp.checked = ch.to != undefined;
                    toInput.style.display = inp.checked ? "" : "none";
                    inp.type = "radio";
                    inp.name = name;
                })(),
                toInput,
            ]),
        ]);
        text1.innerText = select.selectedOptions[0].innerText;
        const block = Div(["pg2-block-small", "pg2-collapsible"], [
            Button("pg2-block-collapse", collapsed ? "+" : "-", btn => {
                collapsed = !collapsed;
                btn.innerText = collapsed ? "+" : "-";
                block.classList.toggle("pg2-collapsed", collapsed);
            }),
            Button("pg2-block-contextmenu", "x", () => {
                const i = this.node.characteristics.indexOf(ch);
                if (i >= 0)
                    this.node.characteristics.splice(i, 1);
                block.parentElement?.removeChild(block);
            }),
            header,
            content,
        ]);
        block.classList.toggle("pg2-collapsed", collapsed);
        return block;
    }
    characAdder(container) {
        const line = Div("pg2-line-small", [
            Button([], "Добавить", () => {
                this.node.characteristics.push({ id: "" });
                const el = this.createCharac(this.node.characteristics.length - 1, false);
                container.appendChild(el);
            }),
        ]);
        return line;
    }
    static createNode() {
        const node = {
            type: "change",
            achievements: [],
            addItems: [],
            removeItems: [],
            characteristics: [],
            goToPart: undefined,
        };
        return node;
    }
}
