import { Button, Div } from "../functions.js";
import { getQuest, saveQuest } from "./functions.js";
import { Editor_Achievements } from "./editors/achievements.js";
import { Editor_Chapters } from "./editors/chapters.js";
import { Editor_Characters } from "./editors/characters.js";
import { Editor_Items } from "./editors/items.js";
import { Editor_Player } from "./editors/player.js";
import { Editor_Quest } from "./editors/quest.js";
export class Editor {
    constructor(callback, key) {
        this.body = Div("pg2-editor-body");
        this.callback = callback;
        this.key = key;
        const quest = getQuest(key);
        this.quest = new Editor_Quest(quest.quest, this.save.bind(this));
        this.characters = new Editor_Characters(quest.characters, this.save.bind(this));
        this.items = new Editor_Items(quest.items, this.save.bind(this));
        this.player = new Editor_Player(quest, this.save.bind(this));
        this.achievements = new Editor_Achievements(quest.achievements, this.save.bind(this));
        this.chapters = new Editor_Chapters(quest, this.save.bind(this));
        this.questFull = quest;
    }
    render() {
        document.body.innerHTML = "";
        document.body.appendChild(Div("body", [
            Div(["header", "pg2"], [
                Button([], "<-", this.saveAndBack.bind(this)),
                Button([], "Квест", this.open.bind(this, this.quest)),
                Button([], "Персонажи", this.open.bind(this, this.characters)),
                Button([], "Предметы", this.open.bind(this, this.items)),
                Button([], "Игрок", this.open.bind(this, this.player)),
                Button([], "Достижения", this.open.bind(this, this.achievements)),
                Button([], "Главы", this.open.bind(this, this.chapters)),
            ]),
            this.body,
        ]));
    }
    saveAndBack() {
        if (this.chapters.opened)
            this.open(this.chapters);
        else
            this.callback();
    }
    open(editor) {
        this.chapters.opened = false;
        editor.render(this.body);
    }
    save() {
        saveQuest(this.key, this.questFull);
    }
}
