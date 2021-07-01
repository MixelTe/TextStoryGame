import { Action, ChapterContent_change, ChapterContent_effect, ChapterContent_question, ChapterContent_speech, ChapterPart, ChapterPartContent, Character, Condition, Item, Player, Quest } from "../questStructure.js";
import { Div } from "../functions.js";
import { QuestFolder } from "./main.js";

let errors = 0;
let marginLeft = 0;
export function checkData(questFolder: QuestFolder)
{
	errors = 0;
	marginLeft = 0;
	document.body.innerHTML = "";
	document.body.classList.remove("fullScren");
	addText(questFolder.questName, true);
	run(checkQuest, questFolder.quest);
	addText("Персонажи:", true);
	run(checkCharacters, questFolder.characters);
	addText("Предметы:", true);
	run(checkItems, questFolder.items);
	addText("Игрок:", true);
	run(checkPlayer, questFolder.player);
	addText("Названия глав:", true);
	run(checkChaptersNames, questFolder.chapterNames);
	addText("Главы:", true);
	run(checkChapters, questFolder.chapters);
	addText("");
	if (errors > 0) addText(`Ошибок: ${errors}`, true, true);
	else addText("Нет ошибок!", true);
}
function addText(text: string, big = false, error = false)
{
	const classes = []
	if (big) classes.push("text-big");
	else classes.push("text-medium");
	if (error) classes.push("text-error");
	const div = Div(classes, [], text);
	div.style.marginLeft = `${marginLeft}em`;
	document.body.appendChild(div);
}
function checkVar(v: any, name: string, type: "string" | "number" | "object", prefix: string | false = "")
{
	const translate = {
		string: "строкой",
		number: "числом",
		object: "объектом/списком",
	}
	if (typeof v == type)
	{
		if (typeof prefix != "boolean") addText(`${prefix}${v}`);
	}
	else
	{
		errors++;
		addText(`${name} должно быть ${translate[type]}`, false, true);
	}
}
function printVar(v: any, ifUndefined: string, prefix = "")
{
	if (v == undefined) addText(`${prefix}${ifUndefined}`);
	else addText(`${prefix}${v}`);
}
function parseJSON(content: string)
{
	try
	{
		return JSON.parse(content);
	}
	catch (e)
	{
		addText("Ошибка чтения файла:", false, true);
		addText(e, false, true);
		return null;
	}
}
function run<T>(f: (v: T) => void, v: T)
{
	try
	{
		f(v);
	}
	catch (e)
	{
		console.error(e);
	}
}


function checkQuest(content: string)
{
	const quest = <Quest>parseJSON(content);
	if (quest == null) return;
	checkVar(quest, "quest", "object", false);
	checkVar(quest.name, "quest.name", "string");
	checkVar(quest.description, "quest.description", "string");
}

function checkCharacters(content: string)
{
	const characters = <Character[]>parseJSON(content);
	if (characters == null) return;
	checkVar(characters, "characters", "object", false);
	characters.forEach((ch, i) =>
	{
		addText(`Персонаж №${i + 1}:`)
		checkVar(ch.id, "character.id", "string", "id: ");
		checkVar(ch.name, "character.name", "string");
		printVar(ch.description, "Нет описания");
		checkVar(ch.friendLevel, "character.friendLevel", "number", "Уровень дружбы: ");
		addText("");
	});
}

function checkItems(content: string)
{
	const items = <Item[]>parseJSON(content);
	if (items == null) return;
	checkVar(items, "items", "object", false);
	items.forEach((item, i) =>
	{
		addText(`Предмет №${i + 1}:`)
		checkVar(item.id, "item.id", "string", "id: ");
		checkVar(item.name, "item.name", "string");
		printVar(item.description, "Нет описания");
		addText("");
	});
}

function checkPlayer(content: string)
{
	const player = <Player>parseJSON(content);
	if (player == null) return;
	checkVar(player.items, "player.items", "object", false);
	addText("Предметы игрока:")
	player.items.forEach((el, i) =>
	{
		checkVar(el, `player.items[${i}]`, "string", "id: ");
	});
	addText("");
	checkVar(player.characteristics, "player.characteristics", "object", false);
	addText("Характеристики игрока:")
	player.characteristics.forEach((el, i) =>
	{
		addText(`Характеристика №${i + 1}:`)
		checkVar(el.id, "el.id", "string", "id: ");
		checkVar(el.name, "el.name", "string");
		printVar(el.description, "Нет описания");
		checkVar(el.value, "el.value", "number", "Значение: ");
		printVar(el.loseIfBelowZero, "false", "Проигрыш если закончитсья: ");
		printVar(el.loseText, "Нет специального текста при проигрыше");
		printVar(el.hasLoseImg, "false", "Есть картинка при проигрыше: ");
		addText("");
	});
}

export function checkChaptersNames(content: string)
{
	const chapters = <string[]>parseJSON(content);
	if (chapters == null) return;
	chapters.forEach((chapter, i) => {
		checkVar(chapter, "Название главы", "string");
	});
}

function checkChapters(chapters: { chapterName: string; parts: string[]; }[])
{
	for (let i = 0; i < chapters.length; i++)
	{
		const chapter = chapters[i];
		addText(`Глава № ${i + 1} (${chapter.chapterName})`, true);
		for (let j = 0; j < chapter.parts.length; j++) {
			const part = chapter.parts[j];
			addText(`Часть №${j + 1}`, true);
			run(checkChapterPart, part);
			addText("");
		}
		addText("");
		addText("");
	}
}

function checkChapterPart(content: string)
{
	const part = <ChapterPart>parseJSON(content);
	if (part == null) return;
	checkVar(part, "part", "object", false);
	checkVar(part.id, "part.id", "string", "id: ");
	printVar(part.backImg, "Стандартный фон");
	checkVar(part.content, "part.content", "object", false);
	addText("Содержимое:");
	addText("");
	checkContent(part.content);
}

function checkContent(content: ChapterPartContent)
{
	for (let i = 0; i < content.length; i++) {
		const el = content[i];
		checkVar(el, "Элемент", "object", false);
		if (typeof el != "object") continue;
		switch (el.type) {
			case "speech": checkContent_speech(el); break;
			case "question": checkContent_question(el); break;
			case "effect": checkContent_effect(el); break;
			case "change": checkContent_change(el); break;
			default: addText(`type элемента должен быть "speech", "question", "change" или "effect"`, false, true);
		}
		addText("");
	};
}
function checkContent_speech(content: ChapterContent_speech | ChapterContent_question)
{
	addText(`Элемент ${content.type}:`);
	checkVar(content.text, "text", "string");
	printVar(content.characterId, "author", "id: ");
	if (content.characterImg != "normal" && content.characterImg != "sad" &&
		content.characterImg != "angry" && content.characterImg != "happy")
	{
		addText(`Иконка персонажа: normal`)
	}
	else
	{
		addText(`Иконка персонажа: ${content.characterImg}`)
	}
}
function checkContent_question(content: ChapterContent_question)
{
	checkContent_speech(content);
	checkVar(content.actions, "actions", "object", false);
	addText("Варианты дейсвий:");
	marginLeft++;
	checkVar(content.actions, "actions", "object", false);
	if (typeof content.actions == "object") checkActions(content.actions);
	marginLeft--;
}
function checkContent_effect(content: ChapterContent_effect)
{
	addText(`Элемент effect:`);
	checkVar(content.duraction, "duraction", "number", "продолжительность: ");
	if (content.effectName != "darkScreen" && content.effectName != "whiteScreen" && content.effectName != "shake")
	{
		errors++;
		addText(`effectName должно быть "darkScreen", "whiteScreen" или "shake"`, false, true);
	}
	else
	{
		addText(`Название эффека: ${content.effectName}`);
	}
}
function checkContent_change(content: ChapterContent_change)
{
	addText(`Элемент effect:`);
	if (typeof content.characteristics == "object")
	{
		addText("Изменение характеристик:")
		marginLeft++;
		for (let j = 0; j < content.characteristics.length; j++) {
			const el = content.characteristics[j];
			checkVar(el, "Элемент", "object", false);
			if (typeof el != "object") continue;
			checkVar(el.id, "id", "string", "id: ");
			if (typeof el.by != "number" && typeof el.to != "number")
			{
				errors++;
				addText("by или to должно быть числом", false, true);
			}
			else if (typeof el.by == "number" && typeof el.to == "number")
			{
				errors++;
				addText("by и to не могут быть указанны одновременно", false, true);
			}
			else if (typeof el.by == "number")
			{
				addText(`Характеристика изменится на ${el.by}`);
			}
			else
			{
				addText(`Характеристика установиьтся в ${el.to}`);
			}
		};
		marginLeft--;
	}
	if (typeof content.addItems == "object")
	{
		addText("Добавление предметов:")
		marginLeft++;
		content.addItems.forEach(el => checkVar(el, "id предмета", "string", "id: "));
		marginLeft--;
	}
	if (typeof content.removeItems == "object")
	{
		addText("Удаление предметов:")
		marginLeft++;
		content.addItems.forEach(el => checkVar(el, "id предмета", "string", "id: "));
		marginLeft--;
	}
}

function checkActions(content: Action[])
{
	const checkCondition = (cond: Condition, n: string) =>
	{
		addText(`${n}`);
		marginLeft++;
		if (typeof cond.partsDone == "object")
		{
			addText(`Законченые части:`);
			cond.partsDone.forEach(el => checkVar(el, "id части", "string", "id: "));
		}
		else
		{
			cond.partsDone = [];
		}

		if (typeof cond.partsNotDone == "object")
		{
			addText(`Не законченые части:`);
			cond.partsNotDone.forEach(el => checkVar(el, "id части", "string", "id: "));
		}
		else
		{
			cond.partsNotDone = [];
		}

		if (typeof cond.characteristic == "object")
		{
			addText(`Характеристики:`);
			for (let i = 0; i < cond.characteristic.length; i++) {
				const el = cond.characteristic[i];
				checkVar(el, "Элемент", "object", false);
				if (typeof el != "object") continue;
				checkVar(el.id, "id", "string", "id: ");
				if (typeof el.lessThen != "number" && typeof el.moreThen != "number")
				{
					errors++;
					addText("lessThen или moreThen должно быть числом", false, true);
				}
				else if (typeof el.lessThen == "number" && typeof el.moreThen == "number")
				{
					addText(`Необходимое значение: ${el.moreThen} < x < ${el.lessThen}`);
				}
				else if (typeof el.lessThen == "number")
				{
					addText(`Необходимое значение: x < ${el.lessThen}`);
				}
				else
				{
					addText(`Необходимое значение: ${el.moreThen} < x`);
				}
			};
		}
		else
		{
			cond.characteristic = [];
		}

		if (typeof cond.items == "object")
		{
			addText(`Предметы:`);
			cond.items.forEach(el => checkVar(el, "id предмета", "string", "id: "));
		}
		else
		{
			cond.items = [];
		}
		marginLeft--;
	}
	for (let i = 0; i < content.length; i++) {
		const el = content[i];
		checkVar(el, "Действие", "object", false);
		if (typeof el != "object") continue;
		checkVar(el.text, "text", "string");
		if (typeof el.conditions == "object") checkCondition(el.conditions, "conditions");
		if (typeof el.showConditions == "object") checkCondition(el.showConditions, "showConditions");
		if (typeof el.result == "object")
		{
			printVar(el.result.goToPart, "Не переходить", "Перейти к части: ");
			if (typeof el.result.content == "object")
			{
				addText("Содержимое после выбора этого действия:")
				marginLeft++;
				checkContent(el.result.content);
				marginLeft--;
			}
		}
	};
}
