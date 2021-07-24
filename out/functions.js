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
window.reloadCSS = () => {
    const links = document.querySelectorAll("link[rel=stylesheet]");
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        link.href += (link.href.indexOf("?") > -1) ? "&refresh" : "?refresh";
    }
};
