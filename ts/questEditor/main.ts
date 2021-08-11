import { Button, confirm_Popup, Div, downloadFile, Input } from "../functions.js";
import { contextMenu, Popup } from "../popup.js";
import { Editor } from "./editor.js";
import { addQuest, Form, getQuest, getQuests, QuestFull, removeQuest, saveQuest } from "./functions.js";
import { Editor_Options } from "./options.js";
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
			const menu = [
				{ text: "Отправить", id: "send" },
				{ text: "Удалить", id: "delete" },
			];
			if (Editor_Options.DownloadQuestOption) menu.push({ text: "Сохранить", id: "download" });
			const r = await contextMenu(quest.name, menu);
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
			else if (r == "download")
			{
				const questData = getQuest(quest.key);
				const text = JSON.stringify(questData);
				downloadFile(`${quest.name}.json`, text);
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
	if (Editor_Options.DownloadQuestOption) return loadQuest();
	if (typeof input.value != 'string' || input.value == "") return;
	const quest = { name: input.value, key: Date.now().toString() };
	input.value = "";
	addQuest(quest);

	input = render();
}

async function loadQuest()
{
	const popup = new Popup();
	popup.title = "Зарузка квеста";
	const fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.accept = ".json,.txt";
	popup.content.appendChild(fileInput);
	const r = await popup.openAsync();
	if (!r) return;
	const files = fileInput.files;
	if (!files) return;
	if (files?.length == 0) return;
	const file = files[0];
	const questData = await file.text();
	const quest = { name: file.name, key: Date.now().toString() };
	addQuest(quest);
	try
	{
		const parsed = <QuestFull>JSON.parse(questData);
		saveQuest(quest.key, parsed);
	}
	catch (e)
	{
		console.error(e);
	}

	input = render();
}