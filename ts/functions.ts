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