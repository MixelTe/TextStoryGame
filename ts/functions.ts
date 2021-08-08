import { Popup } from "./popup.js";

export function Div(classes?: string[] | string, children?: HTMLElement[], innerText?: string)
{
	return initEl("div", classes, children, innerText);
}
export function Span(classes?: string[] | string, children?: HTMLElement[], innerText?: string)
{
	return initEl("span", classes, children, innerText);
}
export function Input(classes?: string[] | string, type?: string, placeholder?: string)
{
	const input = initEl("input", classes, undefined, undefined);
	if (type) input.type = type;
	if (placeholder) input.placeholder = placeholder;
	return input;
}
export function Button(classes?: string[] | string, innerText?: string, clickListener?: (btn: HTMLButtonElement) => void)
{
	const button = initEl("button", classes, undefined, innerText);
	if (clickListener) button.addEventListener("click", clickListener.bind(undefined, button));
	return button;
}
export function TextArea(placeholder = "", classes: string | string[] = [])
{
	const textarea = document.createElement("textarea");
	if (typeof classes == "string") textarea.classList.add(classes);
	else classes.forEach(cls => textarea.classList.add(cls));
	textarea.placeholder = placeholder;
	textarea.addEventListener('input', function ()
	{
		this.style.height = 'auto';
		this.style.height = this.scrollHeight + 5 + 'px';
	});
	return textarea;
}
export function Select(classes?: string[] | string, children?: HTMLElement[], onChange?: (select: HTMLSelectElement) => void, onCreate?: (select: HTMLSelectElement) => void)
{
	const select = initEl("select", classes, children, undefined);
	if (onChange)
	{
		select.addEventListener("change", () => onChange(select));
	}
	if (onCreate) onCreate(select);
	return select;
}
export function SelectPlus(createOptions: (addOption: (innerText?: string, value?: string, classes?: string[] | string) => HTMLOptionElement) => void,
	onChange?: (select: HTMLSelectElement) => void, onCreate?: (select: HTMLSelectElement) => void, classes?: string[] | string)
{
	const select = initEl("select", classes, undefined, undefined);
	createOptions((innerText?: string, value?: string, classes?: string[] | string) =>
	{
		const option = Option(innerText, value, classes)
		select.appendChild(option);
		return option;
	});
	if (onChange)
	{
		select.addEventListener("change", () => onChange(select));
	}
	if (onCreate) onCreate(select);
	return select;
}
export function SelectArray<T>(array: T[], getParam: (el: T) => {innerText: string, value: string, classes?: string[] | string},
	onChange?: (select: HTMLSelectElement) => void, onCreate?: (select: HTMLSelectElement) => void, classes?: string[] | string)
{
	const select = initEl("select", classes, undefined, undefined);
	for (let i = 0; i < array.length; i++) {
		const el = getParam(array[i]);
		select.appendChild(Option(el.innerText, el.value, el.classes));
	}
	if (onChange)
	{
		select.addEventListener("change", () => onChange(select));
	}
	if (onCreate) onCreate(select);
	return select;
}
export function Option(innerText?: string, value?: string, classes?: string[] | string)
{
	const option = initEl("option", classes, undefined, undefined);
	if (value) option.value = value;
	if (innerText) option.innerText = innerText;
	return option;
}
function initEl<K extends keyof HTMLElementTagNameMap>(tagName: K, classes: string[] | string | undefined, children: HTMLElement[] | undefined, innerText: string | undefined)
{
	const el = document.createElement(tagName);
	if (classes)
	{
		if (typeof classes == "string") el.classList.add(classes);
		else classes.forEach(cs => el.classList.add(cs));
	}
	if (innerText) el.innerText = innerText;
	if (children) children.forEach(ch => el.appendChild(ch));

	return el;
}

export function capitalize(text: string)
{
	return text.slice(0, 1).toUpperCase() + text.slice(1);
}
export function copyText(text: string)
{
	const el = document.createElement('textarea');
	el.value = text;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	el.style.opacity = '0';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}
export async function confirm_Popup(text: string, prefix = "Вы уверенны, что хотите удалить ")
{
	const popup = new Popup();
	popup.title = "Удаление";
	popup.content.innerText = prefix + text;
	popup.focusOn = "cancel";
	return popup.openAsync();
}


declare global
{
	interface Window
	{
		reloadCSS: () => void
	}
}
window.reloadCSS = () =>
{
	const links = <HTMLLinkElement[]><any>document.querySelectorAll("link[rel=stylesheet]");
	for (let i = 0; i < links.length; i++) {
		const link = links[i];
		link.href += (link.href.indexOf("?") > -1) ? "&refresh" : "?refresh";
	}
}