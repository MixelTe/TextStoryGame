import { Button, Div, Option, Select } from "../../../functions.js";
import { contextMenu, Popup } from "../../../popup.js";

export function nodeContainer(content: HTMLDivElement, headerTexts: HTMLElement[], collapsed: boolean, openContextMenu?: () => void)
{
	const block = Div(["pg2-block-small", "pg2-collapsible"], [
		Button("pg2-block-collapse", "-", btn =>
		{
			collapsed = !collapsed;
			btn.innerText = collapsed ? "+" : "-";
			block.classList.toggle("pg2-collapsed", collapsed);
		}),
		Button("pg2-block-contextmenu", "···", openContextMenu),
		Div("pg2-block-header", headerTexts),
		content,
	]);
	block.classList.toggle("pg2-collapsed", collapsed);
	return block;
}
