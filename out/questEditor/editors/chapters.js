import { Button, confirm_Popup, Div, Input } from "../../functions.js";
import { Form } from "../functions.js";
import { Editor_Chapter } from "./chapter.js";
export class Editor_Chapters {
    constructor(quest, save) {
        this.quest = quest;
        this.save = save;
        this.opened = false;
    }
    render(body) {
        const input = Input([], "text", "Название главы");
        this.opened = false;
        body.innerHTML = "";
        body.appendChild(Div([], [
            Div("list", this.renderQuests(body)),
            Div("add-item", [
                Form(input, Button([], "Добавить главу"), this.addChapter.bind(this, body, input)),
            ]),
        ]));
    }
    renderQuests(body) {
        const chapters = this.quest.chapters.chaptersList;
        const rendered = [];
        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            const button = Button("pg2-btn-delete", "X", async () => {
                if (await this.removeChapter(i)) {
                    this.render(body);
                }
            });
            const div = Div([], [
                Div([], [], chapter.name),
                button,
            ]);
            rendered.push(div);
            div.addEventListener("click", e => {
                if (e.target != button) {
                    new Editor_Chapter(this.quest, i, this.save).render(body);
                    this.opened = true;
                }
            });
        }
        return rendered;
    }
    addChapter(body, input) {
        if (typeof input.value != 'string' || input.value == "")
            return;
        const chapter = { name: input.value, partsCount: 0 };
        input.value = "";
        this.quest.chapters.chaptersList.push(chapter);
        this.quest.chapters.chapters.push([]);
        this.save();
        this.render(body);
    }
    async removeChapter(index) {
        if (!await confirm_Popup(`главу ${this.quest.chapters.chaptersList[index].name}?`))
            return false;
        if (!await confirm_Popup(`главу ${this.quest.chapters.chaptersList[index].name}? И ВСЁ её содержимое!`, true))
            return false;
        if (!await confirm_Popup(`главу ${this.quest.chapters.chaptersList[index].name}? И ВСЁ её содержимое! Безвозвратно!`))
            return false;
        if (!await confirm_Popup(`главу ${this.quest.chapters.chaptersList[index].name}? И ВСЁ её содержимое! Безвозвратно! Насовсем!`, true))
            return false;
        this.quest.chapters.chaptersList.splice(index, 1);
        this.quest.chapters.chapters.splice(index, 1);
        this.save();
        return true;
    }
}
