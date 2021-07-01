import { Div } from "../functions.js";
import { checkData } from "./questChecker.js";

setText("Перетащите папку с квестом сюда");
window.addEventListener("dragover", e => e.preventDefault());
window.addEventListener("drop", async (e) =>
{
	e.preventDefault();
	if (e.dataTransfer == null) return;
	setText("Загрузка...");
	const questFolder = <QuestFolder>{};
	try {
		questFolder.chapters = [];
		const quest = e.dataTransfer.items[0].webkitGetAsEntry();
		questFolder.questName = quest.name;
		const questFiles = await readFolder(quest);
		for (let i = 0; i < questFiles.length; i++) {
			const el = questFiles[i];
			if (el.isFile)
			{
				switch (el.name) {
					case "characters.json": questFolder.characters = await readFile(el); break;
					case "items.json": questFolder.items = await readFile(el); break;
					case "player.json": questFolder.player = await readFile(el); break;
					case "quest.json": questFolder.quest = await readFile(el); break;
				}
			}
			if (el.isDirectory && el.name == "chapters")
			{
				const chapters = await readFolder(el);
				for (let i = 0; i < chapters.length; i++) {
					const chapter = chapters[i];
					if (chapter.isFile && chapter.name == "chapters.json")
					{
						questFolder.chapterNames = await readFile(chapter);
						continue;
					}
					const chapterData = {
						chapterName: chapter.name,
						parts: <string[]>[],
					};
					const parts = await readFolder(chapter);
					for (let i = 0; i < parts.length; i++) {
						const part = parts[i];
						const data = await readFile(part);
						chapterData.parts.push(data);
					}
					questFolder.chapters.push(chapterData);
				}
			}
		}
		if (questFolder.quest == undefined) throw new Error("Data is empty");
		if (questFolder.chapterNames == undefined) throw new Error("Data is empty");
		if (questFolder.characters == undefined) throw new Error("Data is empty");
		if (questFolder.items == undefined) throw new Error("Data is empty");
		if (questFolder.player == undefined) throw new Error("Data is empty");
	}
	catch (e)
	{
		const text = "Не удалось открыть файлы, проверьте правильность их расположения:";
		const text2 = `Папка с квестом:
- characters.json
- items.json
- player.json
- quest.json
- chapters
- - chapters.json
- - chapter1
- - - part1.json
`;
		document.body.innerHTML = "";
		document.body.classList.add("fullScren");
		document.body.append(
			Div("text-big", [], text),
			Div("text-medium", [], text2),
		);

		console.error(e);
		return;
	}
	checkData(questFolder);
});
async function readFolder(folder: any)
{
	return new Promise<any>((resolve, reject) =>
	{
		folder.createReader().readEntries(resolve, reject);
	});
}
async function readFile(file: any)
{
	return new Promise<any>((resolve, reject) =>
	{
		file.file(function (file: any)
		{
			let reader = new FileReader();
			reader.onload = function ()
			{
				resolve(reader.result);
			}
			reader.onerror = () => reject(reader.error);
			reader.readAsText(file);
		}, reject);
	});
}

export interface QuestFolder
{
	questName: string;
	quest: string;
	characters: string;
	items: string;
	player: string;
	chapterNames: string;
	chapters: {
		chapterName: string;
		parts: string[];
	}[];
}
function setText(text: string)
{
	document.body.innerHTML = "";
	document.body.classList.add("fullScren");
	document.body.appendChild(Div(["text-big", "disabled"], [], text));
}
