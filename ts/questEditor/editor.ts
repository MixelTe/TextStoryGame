import { Button, Div } from "../functions.js";
import { getQuest, QuestFull, saveQuest } from "./functions.js";
import { Editor_Achievements } from "./editors/achievements.js";
import { Editor_Chapters } from "./editors/chapters.js";
import { Editor_Characters } from "./editors/characters.js";
import { Editor_Items } from "./editors/items.js";
import { Editor_Player } from "./editors/player.js";
import { Editor_Quest } from "./editors/quest.js";

export class Editor
{
	private readonly callback: () => void;
	private key: string;
	private questFull: QuestFull;
	private quest: Editor_Quest;
	private characters: Editor_Characters;
	private items: Editor_Items;
	private player: Editor_Player;
	private achievements: Editor_Achievements;
	private chapters: Editor_Chapters;
	private body = Div("pg2-editor-body");
	constructor(callback: () => void, key: string)
	{
		this.callback = callback;
		this.key = key;
		const quest = getQuest(key);
		this.quest = new Editor_Quest(quest.quest, this.save.bind(this));
		this.characters = new Editor_Characters(quest.characters, this.save.bind(this));
		this.items = new Editor_Items(quest.items, this.save.bind(this));
		this.player = new Editor_Player(quest, this.save.bind(this));
		this.achievements = new Editor_Achievements(quest.achievements, this.save.bind(this));
		this.chapters = new Editor_Chapters(quest.chapters, this.save.bind(this));
		this.questFull = quest;
	}
	public render()
	{
		document.body.innerHTML = "";
		document.body.appendChild(Div("body", [
			Div(["header", "pg2"], [
				Button([], "<-", this.saveAndBack.bind(this)),
				Button([], "Квест", this.open.bind(this, this.quest)),
				Button([], "Персонажи", this.open.bind(this, this.characters)),
				Button([], "Предметы", this.open.bind(this, this.items)),
				Button([], "Игрок", this.open.bind(this, this.player)),
				Button([], "Достижения", this.open.bind(this, this.achievements)),
				Button([], "Главы", this.open.bind(this, this.chapters)),
			]),
			this.body,
		]));
	}
	private saveAndBack()
	{
		this.callback();
	}
	private open(editor: { render: (body: HTMLDivElement) => void })
	{
		editor.render(this.body);
	}
	private save()
	{
		saveQuest(this.key, this.questFull);
	}
}
