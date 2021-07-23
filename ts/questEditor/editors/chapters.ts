import { Div } from "../../functions.js";
import { ChapterItem } from "../functions.js";

export class Editor_Chapters
{
	constructor(private chapters: ChapterItem, private save: () => void) { }
	public render(body: HTMLElement)
	{
		body.innerHTML = "";
		body.appendChild(Div([], []));
	}
}
