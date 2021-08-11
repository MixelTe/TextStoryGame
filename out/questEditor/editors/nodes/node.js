import { Button, confirm_Popup, Div } from "../../../functions.js";
import { contextMenu, Popup } from "../../../popup.js";
import { Editor_Options } from "../../options.js";
import { createNode, createNodeTypeSelect } from "../nodeTools.js";
export class Editor_Node {
    constructor(quest, chapter) {
        this.quest = quest;
        this.chapter = chapter;
        this.nodeBody = Div();
    }
    create(content, headerTexts, collapsed) {
        const header = Div("pg2-block-header", headerTexts);
        const block = Div(["pg2-block-small", "pg2-collapsible"], [
            Button("pg2-block-collapse", collapsed ? "+" : "-", btn => {
                collapsed = !collapsed;
                btn.innerText = collapsed ? "+" : "-";
                block.classList.toggle("pg2-collapsed", collapsed);
            }),
            Button("pg2-block-contextmenu", "···", () => {
                this.nodeContextmenu(header.innerText);
            }),
            header,
            content,
        ]);
        block.classList.toggle("pg2-collapsed", collapsed);
        this.nodeBody = block;
        return block;
    }
    async nodeContextmenu(nodeName) {
        let nodeNameShort = nodeName.slice(0, 50);
        if (nodeName.length > 50)
            nodeNameShort += "...";
        const menu = [
            { text: "Добавить элемент", subItems: [
                    { text: "до", id: "add_before" },
                    { text: "после", id: "add_after" },
                ]
            },
            { text: "Удалить этот элемент", id: "del_this" },
        ];
        if (Editor_Options.PrintNodeOption)
            menu.push({ text: "Print node", id: "print_node" });
        const r = await contextMenu(nodeNameShort, menu);
        if (r == "add_before") {
            this.addNodePopup(`Добавить до "${nodeNameShort}"`, node => {
                this.chapter.addBefore(node, this.nodeBody);
            });
        }
        else if (r == "add_after") {
            this.addNodePopup(`Добавить после "${nodeNameShort}"`, node => {
                this.chapter.addAfter(node, this.nodeBody);
            });
        }
        else if (r == "del_this") {
            if (!await confirm_Popup(`элемент "${nodeName}", и ВСЁ его содержимое?`))
                return;
            this.chapter.deleteNode(this);
        }
        else if (r == "print_node") {
            console.log(this.node);
        }
    }
    async addNodePopup(title, add) {
        const popup = new Popup();
        popup.title = title;
        popup.okText = "Добавить";
        const select = createNodeTypeSelect();
        popup.content.classList.add("ta-center");
        popup.content.appendChild(select);
        const r = await popup.openAsync();
        if (r)
            add(createNode(select.value));
    }
}
