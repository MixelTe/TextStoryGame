import { Button, copyText, Div } from "../functions.js";
import { Popup } from "../popup.js";
import { Spinner } from "../spinner.js";
import { getName, InputPlus, setName, TextAreaPlus } from "./functions.js";
export class Sender {
    async open(quest) {
        const data = this.createData(quest);
        let r = await this.createPg1(data).openAsync();
        if (!r)
            return;
        const json = JSON.stringify(data);
        r = await this.send(json);
        if (r)
            return this.createPg2().openAsync();
        return this.createPg3(json).openAsync();
    }
    createPg1(data) {
        const popup = new Popup();
        popup.title = "Отправка квеста";
        popup.okText = "Отправить";
        popup.content.appendChild(Div([], [
            Div("pg2-line", [
                Div([], [], "Ваше имя:"),
                InputPlus("pg2", "text", "Имя")(inp => { data.author.name = inp.value; setName(data.author.name); }, inp => inp.value = data.author.name)(),
            ]),
            Div("pg2-line", [
                Div([], [], "Комментарий:"),
                TextAreaPlus("Комментарий", "pg2")(ta => data.author.comment = ta.value, ta => ta.value = data.author.comment)(),
            ]),
        ]));
        return popup;
    }
    createPg2() {
        const popup = new Popup();
        popup.title = "Отправка квеста";
        popup.cancelBtn = false;
        popup.content.appendChild(Div([], [
            Div("pg2-line", [
                Div([], [], "Квест отправлен!"),
            ]),
        ]));
        return popup;
    }
    createPg3(data) {
        const popup = new Popup();
        popup.title = "Отправка квеста";
        popup.cancelBtn = false;
        popup.content.appendChild(Div([], [
            Div("pg2-line", [
                Div([], [], "К сожалению не удалось отправить данные на сервер."),
            ]),
            Div("pg2-line", [
                Div([], [], "Можете попробовать ещё раз или самостоятельно отправить данные автору: "),
                Button(["sender-copybutton"], "Копировать данные", this.copyText.bind(this, data)),
            ]),
        ]));
        return popup;
    }
    async send(json) {
        const spinner = new Spinner();
        spinner.show();
        let sent = false;
        let r;
        try {
            r = await fetch("http://mixel.somee.com/textstorygame/api", {
                method: "POST",
                headers: {
                    "Content-Type": "text/json",
                },
                body: json,
            });
            if (!r.ok) {
                throw new Error(`service api call failed (text) status: ${r.status}`);
            }
            sent = true;
        }
        catch (e) {
            console.error(e);
        }
        spinner.hide();
        return sent;
    }
    copyText(text) {
        copyText(text);
        const popup = Div(["popup-small", "popup-small-show"], [Div([], [], "Скопировано")]);
        document.body.appendChild(popup);
        setTimeout(() => {
            popup.classList.remove("popup-small-show");
            setTimeout(() => { document.body.removeChild(popup); }, 500);
        }, 2000);
    }
    createData(data) {
        return {
            author: {
                name: getName(),
                comment: "",
            },
            data,
        };
    }
}
