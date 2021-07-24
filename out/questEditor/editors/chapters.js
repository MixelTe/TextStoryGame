import { Div } from "../../functions.js";
export class Editor_Chapters {
    constructor(chapters, save) {
        this.chapters = chapters;
        this.save = save;
    }
    render(body) {
        body.innerHTML = "";
        body.appendChild(Div([], []));
    }
}
