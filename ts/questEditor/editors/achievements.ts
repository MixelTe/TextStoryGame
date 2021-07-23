import { Div } from "../../functions.js";
import { Achievement } from "../../questStructure.js";

export class Editor_Achievements
{
	constructor(private achievement: Achievement[], private save: () => void) { }
	public render(body: HTMLElement)
	{
		body.innerHTML = "";
		body.appendChild(Div([], []));
	}
}
