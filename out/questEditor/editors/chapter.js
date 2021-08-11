import { Button, confirm_Popup, Div, Select } from "../../functions.js";
import { InputPlus } from "../functions.js";
import { createNode, createNodeTypeSelect, renderNode } from "./nodeTools.js";
export class Editor_Chapter {
    constructor(quest, index, save) {
        this.quest = quest;
        this.index = index;
        this.save = save;
        this.partContent = Div("pg2-line");
        this.nodeContainer = Div("pg2-line");
        this.select = Select();
        this.partId = "0";
        this.partIndex = 0;
        this.openNewPartEditor = (partId) => "0";
    }
    render(body, partId = "0", callback = () => { }) {
        this.partContent = Div("pg2-line");
        body.innerHTML = "";
        this.partId = partId;
        this.partIndex = this.getIndex(this.partId);
        if (this.partId == "0") {
            body.appendChild(Div([], [
                Div("pg2-line", [
                    InputPlus(["pg2", "ta-center"], "text", "Название главы")(inp => { this.quest.chapters.chaptersList[this.index].name = inp.value; this.save(); }, inp => inp.value = this.quest.chapters.chaptersList[this.index].name)(),
                ]),
                this.partContent,
            ]));
        }
        else {
            body.appendChild(Div([], [
                Div(["pg2-line", "ta-center"], [
                    Button([], "На уровень выше", callback),
                ]),
                this.partContent,
            ]));
        }
        this.openNewPartEditor = (newPartId) => {
            return new Editor_Chapter(this.quest, this.index, this.save).render(body, newPartId, () => {
                this.render(body, partId, callback);
            });
        };
        this.renderPart();
        return this.quest.chapters.chapters[this.index][this.partIndex].id;
    }
    renderPart() {
        this.renderNodes();
        this.select = createNodeTypeSelect();
        this.partContent.appendChild(Div("pg2-line-wrap", [
            this.select,
            Button("margin-right", "Добавить элемент", this.addNode.bind(this)),
        ]));
    }
    renderNodes() {
        const content = this.quest.chapters.chapters[this.index][this.partIndex].content;
        this.nodeContainer = Div("pg2-line");
        for (let i = 0; i < content.length; i++) {
            this.renderNode(content[i], i != content.length - 1);
        }
        this.partContent.appendChild(this.nodeContainer);
    }
    addNode() {
        const node = createNode(this.select.value);
        this.quest.chapters.chapters[this.index][this.partIndex].content.push(node);
        this.renderNode(node, false);
    }
    async removeLast() {
        if (!await confirm_Popup(`последний элемент?`))
            return;
        if (this.nodeContainer.lastChild)
            this.nodeContainer.removeChild(this.nodeContainer.lastChild);
        this.quest.chapters.chapters[this.index][this.partIndex].content.pop();
    }
    renderNode(node, collapsed = true) {
        const el = renderNode(node, this.quest, this, collapsed);
        this.nodeContainer.appendChild(el);
    }
    getIndex(id) {
        const chapter = this.quest.chapters.chapters[this.index];
        const i = chapter.findIndex(ch => ch.id == id);
        if (i < 0) {
            const part = this.createPart(this.createNewPartId());
            chapter.push(part);
            return chapter.length - 1;
        }
        return i;
    }
    createNewPartId() {
        const chapter = this.quest.chapters.chapters[this.index];
        let num = parseInt(chapter[chapter.length - 1].id);
        if (isNaN(num))
            num = Date.now();
        return `${num + 1}`;
    }
    createPart(id) {
        const part = {
            backImg: "",
            id,
            content: [],
        };
        return part;
    }
    addBefore(node, ref) {
        const el = renderNode(node, this.quest, this, false);
        this.nodeContainer.insertBefore(el, ref);
    }
    addAfter(node, ref) {
        const el = renderNode(node, this.quest, this, false);
        this.nodeContainer.insertBefore(el, ref.nextSibling);
    }
    deleteNode(node) {
        this.nodeContainer.removeChild(node.nodeBody);
        const content = this.quest.chapters.chapters[this.index][this.partIndex].content;
        const i = content.indexOf(node.node);
        if (i >= 0)
            content.splice(i, 1);
        this.save();
    }
    hasPartContent(partId) {
        if (partId == undefined)
            return false;
        const chapter = this.quest.chapters.chapters[this.index];
        const part = chapter.find(ch => ch.id == partId);
        if (part == undefined)
            return false;
        return part.content.length != 0;
    }
}
