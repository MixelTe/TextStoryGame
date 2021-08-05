interface PopupEvenListener {
	"close": (confirmed: boolean, popup: Popup) => void;
	"ok": (popup: Popup) => void;
	"cancel": (popup: Popup) => void;
}
export class Popup
{
	public content = Div();
	public set title(v: string) { this.titleEl.innerText = v; }
	public get title(): string { return this.titleEl.innerText }
	public set cancelText(v: string) { this.cancelBtnEl.innerText = v; }
	public get cancelText(): string { return this.cancelBtnEl.innerText }
	public set okText(v: string) { this.okBtnEl.innerText = v; }
	public get okText(): string { return this.okBtnEl.innerText }
	public set okBtn(v: boolean) { this.okBtnEl.style.display = v ? "" : "none"; }
	public get okBtn(): boolean { return this.okBtnEl.style.display != "none" }
	public set cancelBtn(v: boolean) { this.cancelBtnEl.style.display = v ? "" : "none"; }
	public get cancelBtn(): boolean { return this.cancelBtnEl.style.display != "none" }

	private onClose: ((confirmed: boolean, popup: Popup) => void)[] = [];
	private onOk: ((popup: Popup) => void)[] = [];
	private onCancel: ((popup: Popup) => void)[] = [];
	private body = Div("popup");
	private titleEl = Div("popup-title");
	private cancelBtnEl = Button([], "Отмена", this.close.bind(this, false));
	private okBtnEl = Button([], "ОК", this.close.bind(this, true));
	private resolve: ((value: boolean) => void) | null = null;
	protected openPopup()
	{
		this.body = Div("popup");
		this.body.appendChild(Div("popup-block", [
			Div("popup-header", [
				this.titleEl,
				Button("popup-close", "x", this.close.bind(this, false))
			]),
			Div("popup-content", [this.content]),
			Div("popup-footer", [ this.cancelBtnEl, this.okBtnEl ]),
		]));
		document.body.appendChild(this.body);
	}
	private close(confirmed: boolean)
	{
		document.body.removeChild(this.body);
		this.fireEvent(confirmed ? "ok" : "cancel");
		this.fireEvent("close", confirmed);
		if (this.resolve) this.resolve(confirmed);
	}
	private fireEvent(type: keyof PopupEvenListener, v = false)
	{
		switch (type) {
			case "close": this.onClose.forEach(f => f(v, this)); break;
			case "ok": this.onOk.forEach(f => f(this)); break;
			case "cancel": this.onCancel.forEach(f => f(this)); break;
			default: throw new Error(`Listener can be: "close", "ok" or "cancel". Input: ${type}`);
		}
	}


	public open()
	{
		this.openPopup();
	}
	public openAsync()
	{
		return new Promise<boolean>((resolve: (value: boolean) => void) =>
		{
			this.resolve = resolve;
			this.openPopup();
		});
	}
	public addListener<T extends keyof PopupEvenListener>(type: T, f: PopupEvenListener[T])
	{
		const fn = <any>f;
		switch (type) {
			case "close": this.onClose.push(fn); break;
			case "ok": this.onOk.push(fn); break;
			case "cancel": this.onCancel.push(fn); break;
			default: throw new Error(`Listener can be: "close", "ok" or "cancel". Input: ${type}`);
		}
	}
	public removeListener<T extends keyof PopupEvenListener>(type: T, f: PopupEvenListener[T])
	{
		const fn = <any>f;
		switch (type) {
			case "close": return removeFromArray(this.onClose, fn);
			case "ok": return removeFromArray(this.onOk, fn);
			case "cancel": return removeFromArray(this.onCancel, fn);
			default: throw new Error(`Listener can be: "close", "ok" or "cancel". Input: ${type}`);
		}
	}
}
function removeFromArray<T>(array: T[], item: T)
{
	const i = array.indexOf(item);
	if (i >= 0) array.splice(i, 1);
	return i >= 0;
}

function Div(classes?: string[] | string, children?: HTMLElement[], innerText?: string)
{
	return initEl("div", classes, children, innerText);
}
function Button(classes?: string[] | string, innerText?: string, clickListener?: (btn: HTMLButtonElement) => void)
{
	const button = initEl("button", classes, undefined, innerText);
	if (clickListener) button.addEventListener("click", clickListener.bind(undefined, button));
	return button;
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