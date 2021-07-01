import { Action, ChapterContent_effect, ChapterContent_question, ChapterContent_speech, ChapterPart, ChapterPartContent, Character, Condition, Item, Player, Quest } from "./questStructure.js";

export function parseQuest(content: string)
{
	const quest = <Quest>JSON.parse(content);
	if (typeof quest.name != "string") throw new Error('quest.name must be string');
	if (typeof quest.description != "string") quest.description = "";
	return quest;
}

export function parseCharacters(content: string)
{
	const characters = <Character[]>JSON.parse(content);
	characters.forEach((ch, i) =>
	{
		if (typeof ch.id != "string") throw new Error(`characters[${i}].id must be string`);
		if (typeof ch.name != "string") throw new Error(`characters[${i}].name must be string`);
		if (typeof ch.description != "string") ch.description = "";
		if (typeof ch.friendLevel != "number") throw new Error(`characters[${i}].name must be number`);
	});
	return characters;
}

export function parseItems(content: string)
{
	const items = <Item[]>JSON.parse(content);
	items.forEach((item, i) =>
	{
		if (typeof item.id != "string") throw new Error(`items[${i}].id must be string`);
		if (typeof item.name != "string") throw new Error(`items[${i}].name must be string`);
		if (typeof item.description != "string") item.description = "";
	});
	return items;
}

export function parsePlayer(content: string)
{
	const player = <Player>JSON.parse(content);
	if (typeof player.items != "object") throw new Error('player.items must be list');
	player.items.forEach((el, i) =>
	{
		if (typeof el != "string") throw new Error(`player.items[${i}] element must be string`);
	});
	if (typeof player.characteristics != "object") throw new Error('player.characteristics must be list');
	player.characteristics.forEach((el, i) =>
	{
		if (typeof el.id != "string") throw new Error(`player.characteristics[${i}].id must be string`);
		if (typeof el.name != "string") throw new Error(`player.characteristics[${i}].name must be string`);
		if (typeof el.description != "string") el.description = "";
		if (typeof el.value != "number") throw new Error(`player.characteristics[${i}].name must be number`);
		if (typeof el.loseIfBelowZero != "boolean") el.loseIfBelowZero = false;
		if (typeof el.loseText != "string") el.loseText = "";
		if (typeof el.hasLoseImg != "boolean") el.hasLoseImg = false;
	});
}

export function parseChapters(content: string)
{
	const chapters = <string[]>JSON.parse(content);
	if (typeof chapters != "object") throw new Error('chapters must be object');
	chapters.forEach((chapter, i) => {
		if (typeof chapter != "string") throw new Error(`chapters[${i}] must be string`);
	});
	return chapters;
}

export function parseChapterPart(content: string)
{
	const part = <ChapterPart>JSON.parse(content);
	if (typeof part.id != "string") throw new Error('part.id must be string');
	if (typeof part.backImg != "string") part.backImg = "";
	if (typeof part.content != "object") throw new Error('part.content must be object');
	checkContent(part.content);
	return part;
}

function checkContent(content: ChapterPartContent)
{
	content.forEach(el =>
	{
		const errorText = `part.content[].type must be "speech", "question" or "effect"`;
		if (typeof el.type != "string") throw new Error(errorText);
		switch (el.type) {
			case "speech": checkContent_speech(el); break;
			case "question": checkContent_question(el); break;
			case "effect": checkContent_effect(el); break;
			default: throw new Error(errorText);
		}
	});
}
function checkContent_speech(content: ChapterContent_speech | ChapterContent_question)
{
	const error = (text: string) =>
	{
		throw new Error(`part.content[].${text}`);
	}
	const errorText = `characterImg must be "normal", "sad", "angry" or "happy"`
	if (typeof content.text != "string") error(`text must be string`);
	if (typeof content.characterId != "string") error(`characterId must be string`);
	if (typeof content.characterImg != "string") content.characterImg = "normal";
	if (content.characterImg != "normal" && content.characterImg != "sad" &&
		content.characterImg != "angry" && content.characterImg != "happy")
	{
		error(errorText);
	}
}
function checkContent_question(content: ChapterContent_question)
{
	const error = (text: string) =>
	{
		throw new Error(`part.content[].${text}`);
	}
	checkContent_speech(content);
	if (typeof content.actions != "object") error(`actions must be list`);
	checkActions(content.actions);
}
function checkContent_effect(content: ChapterContent_effect)
{
	const error = (text: string) =>
	{
		throw new Error(`part.content[].${text}`);
	}
	const errorText = `effectName must be "darkScreen", "whiteScreen" or "shake"`;
	if (typeof content.duraction != "number") error(`duraction must be number`);
	if (typeof content.effectName != "string") error(errorText);
	if (content.effectName != "darkScreen" && content.effectName != "whiteScreen" && content.effectName != "shake")
	{
		error(errorText);
	}
}

function checkActions(content: Action[])
{
	const error = (text: string) =>
	{
		throw new Error(`part.content[].actions[].${text}`);
	}
	const checkCondition = (cond: Condition, n: string) =>
	{
		if (typeof cond.partsDone == "object")
		{
			cond.partsDone.forEach((el, j) =>
			{
				if (typeof el != "string") error(`${n}.partsDone[${j}] must be string`);
			});
		}
		else
		{
			cond.partsDone = [];
		}

		if (typeof cond.partsNotDone == "object")
		{
			cond.partsDone.forEach((el, j) =>
			{
				if (typeof el != "string") error(`${n}.partsNotDone[${j}] must be string`);
			});
		}
		else
		{
			cond.partsNotDone = [];
		}

		if (typeof cond.characteristic == "object")
		{
			cond.characteristic.forEach((el, j) =>
			{
				if (typeof el != "object") error(`${n}.characteristic[${j}] must be object`);
				if (typeof el.id != "string") error(`${n}.characteristic[${j}].id must be string`);
				if (typeof el.lessThen != "number" && typeof el.moreThen != "number")
				{
					error(`${n}.characteristic[${j}].lessThen or .moreThen must be number`);
				}
			});
		}
		else
		{
			cond.characteristic = [];
		}

		if (typeof cond.items == "object")
		{
			cond.items.forEach((el, j) =>
			{
				if (typeof el != "string") error(`${n}.items[${j}] must be string`);
			});
		}
		else
		{
			cond.items = [];
		}
	}
	content.forEach(el =>
	{
		if (typeof el.text != "string") error(`text must be string`);
		if (typeof el.conditions == "object") checkCondition(el.conditions, "conditions");
		if (typeof el.showConditions == "object") checkCondition(el.showConditions, "showConditions");
		if (typeof el.result == "object")
		{
			if (typeof el.result.changeCharacteristics == "object")
			{
				el.result.changeCharacteristics.forEach((el2, j) =>
				{
					if (typeof el2 != "object") error(`result.changeCharacteristics[${j}] must be object`);
					if (typeof el2.id != "string") error(`result.changeCharacteristics[${j}].id must be string`);
					if (typeof el2.by != "number" && typeof el2.to != "number")
					{
						error(`result.changeCharacteristics[${j}].by or .to must be number`);
					}
				});
			}
			if (typeof el.result.addItems == "object")
			{
				el.result.addItems.forEach((el, j) =>
				{
					if (typeof el != "string") error(`result.addItems[${j}] must be string`);
				});
			}
			if (typeof el.result.content == "object")
			{
				checkContent(el.result.content);
			}
		}
	});
}
