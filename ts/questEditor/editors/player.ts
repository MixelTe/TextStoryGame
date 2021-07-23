import { Div } from "../../functions.js";
import { Player } from "../../questStructure.js";

export class Editor_Player
{
	constructor(private player: Player, private save: () => void) { }
	public render(body: HTMLElement)
	{
		body.innerHTML = "";
		body.appendChild(Div([], []));
	}
}
