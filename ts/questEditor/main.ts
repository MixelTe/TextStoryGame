import { Button, confirm_Popup, Div, Input } from "../functions.js";
import { contextMenu } from "../popup.js";
import { Editor } from "./editor.js";
import { addQuest, Form, getQuest, getQuests, removeQuest } from "./functions.js";
import { Sender } from "./sender.js";

let input = render();

function render()
{
	const input = Input([], "text", "Название квеста");
	document.body.innerHTML = "";
	document.body.appendChild(Div("body", [
		Div(["header", "pg1"], [
			// Button([], "Назад"),
			Div([], [], "Выберите квест")
		]),
		Div("list", renderQuests()),
		Div("add-item", [
			Form(input, Button([], "Добавить квест"), createQuest),
		]),
	]));
	return input;
}
function renderQuests()
{
	const quests = getQuests();
	const rendered = [];
	for (let i = 0; i < quests.length; i++) {
		const quest = quests[i];
		const button = Button([], "···", async () =>
		{
			const r = await contextMenu(quest.name, [
				{ text: "Отправить", id: "send" },
				{ text: "Удалить", id: "delete" },
			]);
			if (r == "delete")
			{
				if (await confirm_Popup(`квест ${quest.name}?`))
				{
					if (await confirm_Popup(`квест ${quest.name}? Вы не сможете восстановить квест!`, true))
					{
						if (await confirm_Popup(`квест ${quest.name}? Вы потеряете ВСЁ содержимое!`))
						{
							if (await confirm_Popup(`квест ${quest.name}? Вы точно уверенны?`, true))
							{
								removeQuest(quest.key);
								input = render();
							}
						}
					}
				}
			}
			else if (r == "send")
			{
				new Sender().open(getQuest(quest.key));
			}
		});
		const div = Div([], [
			Div([], [], quest.name),
			button,
		]);
		rendered.push(div);
		div.addEventListener("click", e =>
		{
			if (e.target != button)
			{
				new Editor(() =>
				{
					input = render();
				}, quest.key).render();
			}
		});
	}
	return rendered;
}

function createQuest()
{
	if (typeof input.value != 'string' || input.value == "") return;
	const quest = { name: input.value, key: Date.now().toString() };
	input.value = "";
	addQuest(quest);

	input = render();
}