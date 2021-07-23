import { Div } from "../../functions.js";
import { Quest } from "../../questStructure.js";

export class Editor_Quest
{
	constructor(private quest: Quest, private save: () => void) { }
	public render(body: HTMLElement)
	{
		body.innerHTML = "";
		body.appendChild(Div([], []));
	}
}
