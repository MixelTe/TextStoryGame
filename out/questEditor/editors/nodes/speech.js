import { Div, Option, Select, SelectPlus, Span } from "../../../functions.js";
import { TextAreaPlus } from "../../functions.js";
import { Editor_Options } from "../../options.js";
import { Editor_Node } from "./node.js";
export class Editor_Node_speech extends Editor_Node {
    constructor(quest, node, chapter) {
        super(quest, chapter);
        this.node = node;
    }
    render(collapsed = true) {
        const deletedChar = this.node.character != "" && this.node.character != "author" && this.quest.characters.find(ch => ch.id == this.node.character) == undefined;
        const emotionsContainer = Div("pg2-line-small");
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
                            text1.innerText = select.selectedOptions[0].innerText + ": ";
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
                        text1.innerText = select.selectedOptions[0].innerText + ": ";
                    }
                    if (select.value == "author")
                        emotionsContainer.style.display = "none";
                }),
            ]),
            emotionsContainer,
            Div("pg2-line-small", [
                TextAreaPlus("Текст/речь", [])(inp => { this.node.text = inp.value; this.chapter.save(); text2.innerText = this.node.text; }, inp => { inp.value = this.node.text; text2.innerText = this.node.text; })(),
            ]),
        ]);
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
    static createNode() {
        const node = {
            type: "speech",
            character: "author",
            characterImg: "normal",
            text: ""
        };
        return node;
    }
}
