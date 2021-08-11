import { Popup } from "./popup.js";
export function Div(classes, children, innerText) {
    return initEl("div", classes, children, innerText);
}
export function Span(classes, children, innerText) {
    return initEl("span", classes, children, innerText);
}
export function Input(classes, type, placeholder) {
    const input = initEl("input", classes, undefined, undefined);
    if (type)
        input.type = type;
    if (placeholder)
        input.placeholder = placeholder;
    return input;
}
export function Button(classes, innerText, clickListener) {
    const button = initEl("button", classes, undefined, innerText);
    if (clickListener)
        button.addEventListener("click", clickListener.bind(undefined, button));
    return button;
}
export function TextArea(placeholder = "", classes = []) {
    const textarea = document.createElement("textarea");
    if (typeof classes == "string")
        textarea.classList.add(classes);
    else
        classes.forEach(cls => textarea.classList.add(cls));
    textarea.placeholder = placeholder;
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 5 + 'px';
    });
    return textarea;
}
export function Select(classes, children, onChange, onCreate) {
    const select = initEl("select", classes, children, undefined);
    if (onChange) {
        select.addEventListener("change", () => onChange(select));
    }
    if (onCreate)
        onCreate(select);
    return select;
}
export function SelectPlus(createOptions, onChange, onCreate, classes) {
    const select = initEl("select", classes, undefined, undefined);
    createOptions((innerText, value, classes) => {
        const option = Option(innerText, value, classes);
        select.appendChild(option);
        return option;
    });
    if (onChange) {
        select.addEventListener("change", () => onChange(select));
    }
    if (onCreate)
        onCreate(select);
    return select;
}
export function SelectArray(array, getParam, onChange, onCreate, classes) {
    const select = initEl("select", classes, undefined, undefined);
    for (let i = 0; i < array.length; i++) {
        const el = getParam(array[i]);
        select.appendChild(Option(el.innerText, el.value, el.classes));
    }
    if (onChange) {
        select.addEventListener("change", () => onChange(select));
    }
    if (onCreate)
        onCreate(select);
    return select;
}
export function Option(innerText, value, classes) {
    const option = initEl("option", classes, undefined, undefined);
    if (value)
        option.value = value;
    if (innerText)
        option.innerText = innerText;
    return option;
}
function initEl(tagName, classes, children, innerText) {
    const el = document.createElement(tagName);
    if (classes) {
        if (typeof classes == "string")
            el.classList.add(classes);
        else
            classes.forEach(cs => el.classList.add(cs));
    }
    if (innerText)
        el.innerText = innerText;
    if (children)
        children.forEach(ch => el.appendChild(ch));
    return el;
}
export function capitalize(text) {
    return text.slice(0, 1).toUpperCase() + text.slice(1);
}
export function copyText(text) {
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
export async function confirm_Popup(text, reverse = false, prefix = "Вы уверенны, что хотите удалить ") {
    const popup = new Popup();
    popup.title = "Удаление";
    popup.content.innerText = prefix + text;
    popup.focusOn = "cancel";
    popup.reverse = reverse;
    return popup.openAsync();
}
window.reloadCSS = () => {
    const links = document.querySelectorAll("link[rel=stylesheet]");
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        link.href += (link.href.indexOf("?") > -1) ? "&refresh" : "?refresh";
    }
};
