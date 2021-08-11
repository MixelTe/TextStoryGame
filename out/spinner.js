import { Div } from "./functions.js";
export class Spinner {
    constructor() {
        this.body = Div("spinner");
        const parts = 13;
        const spinner = Div();
        const angleStep = 360 / parts;
        const delayStep = 1 / parts;
        for (let i = 0; i < 13; i++) {
            const subpart = Div();
            const part = Div([], [subpart]);
            spinner.appendChild(part);
            part.style.transform = `rotate(${angleStep * i}deg) translateX(var(--trx--))`;
            subpart.style.animationDelay = `${delayStep * i}s`;
        }
        this.body.appendChild(spinner);
    }
    show() {
        document.body.appendChild(this.body);
    }
    hide() {
        document.body.removeChild(this.body);
    }
}
