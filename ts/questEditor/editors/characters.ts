import { Div } from "../../functions.js";
import { Character } from "../../questStructure.js";

export class Editor_Characters
{
	constructor(private character: Character[], private save: () => void) { }
	public render(body: HTMLElement)
	{
		body.innerHTML = "";
		body.appendChild(Div([], []));
	}
}
