import { Button, Div, Input } from "../functions.js";
import { Editor } from "./editor.js";
import { addQuest, getQuests, removeQuest } from "./functions.js";

let input = render();

function render()
{
	const input = Input([], "text", "Название квеста");
	document.body.innerHTML = "";
	document.body.appendChild(Div("body", [
		Div(["header", "pg1"], [
			// Button([], "Назад"),
			Div([], [], "Выберете квест")
		]),
		Div("pg1-quest-list", renderQuests()),
		Div("pg1-quest-add", [
			input,
			Button([], "Добавить квест", createQuest),
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
		const button = Button([], "Удалить", () =>
		{
			removeQuest(quest.key);
			input = render();
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