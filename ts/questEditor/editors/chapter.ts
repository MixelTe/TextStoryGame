import { Div } from "../../functions.js";
import { QuestFull } from "../functions.js";

export class Editor_Chapter
{
	constructor(private quest: QuestFull, private index: number, private save: () => void) { }
	public render(body: HTMLElement)
	{
		body.innerHTML = "";
		body.appendChild(Div([], [
			Div([], [], `Chapter №${this.index}`),
		]));
	}
}