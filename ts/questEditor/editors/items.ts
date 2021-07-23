import { Div } from "../../functions.js";
import { Item } from "../../questStructure.js";

export class Editor_Items
{
	constructor(private item: Item[], private save: () => void) { }
	public render(body: HTMLElement)
	{
		body.innerHTML = "";
		body.appendChild(Div([], []));
	}
}
