# Структура квеста
## Расположение файлов
Папка_квеста (quest№)

- quest.json

- characters.json

- items.json

- player.json

- chapters

- - chapters.json

- - chapter№

- - - part№.json

- images

- - cover.png

- - background

- - - name.png

- - items

- - - id.png

- - characteristics

- - - id

- - - - icon.png

- - - - lose.png

- - characters

- - - characterId

- - - - angry.png

- - - - happy.png

- - - - normal.png

- - - - sad.png

## quest.json
Содержимое:
``` json
{
	"name": "Название квеста",
	"description": "Описание квеста"
}
```

## characters.json
Содержимое:
``` json
[
	{
		"id": "id персонажа",
		"name": "Имя персонажа",
		"description": "Описание персонажа",
		"friendLevel": 0
	}
]
```
Для слов повествования (без картинки и имени), существует персонаж с id author - не используйте это id для своего персонажа.

description - необязательно указывать

## items.json
Содержимое:
``` json
[
	{
		"id": "id предмета",
		"name": "Название предмета",
		"description": "Описание предмета"
	}
]
```
description - необязательно указывать

## player.json
Содержимое:
``` json
{
	"items": [
		"id предмета"
	],
	"characteristics": [
		{
			"id": "id характеристики",
			"name": "Имя характеристики",
			"description": "Описание характеристики",
			"value": 0,
			"loseIfBelowZero": true,
			"loseText": "Текст о проигрыше, закончилась эта характеристика",
			"hasLoseImg": true
		}
	]
}
```
loseIfBelowZero - проигрывает ли игрок, если значение характеристики меньше 0

hasLoseImg - есть ли специальная картинка для такого конца игры.

description - необязательно указывать

loseIfBelowZero - необязательно указывать, false по умолчанию

loseText - необязательно указывать

hasLoseImg - необязательно указывать, false по умолчанию

## chapters.json
Содержимое:
``` json
[
	"Название главы №1",
	"Название главы №2"
]
```

## part.json
Содержимое:
``` json
{
	"id": "id части",
	"backImg": "Фоновая картинка (img.png)",
	"content": []
}
```
backImg - необязательно указывать
### Содержимое content:
characterImg - необязательно указывать, normal по умолчанию

characterId - необязательно указывать, author по умолчанию

Обычная речь:
``` json
{
	"type": "speech",
	"characterId": "id персонажа, который говорит",
	"characterImg": "Иконка персонажа: normal или sad или angry или happy",
	"text": "Речь персонажа"
}
```
Эффект для экрана:
``` json
{
	"type": "effect",
	"effectName": "darkScreen, whiteScreen или shake",
	"duraction": 1
}
```
Изменение состояния игрока:
``` json
{
	"type": "change",
	"addItems": ["id предмета"],
	"removeItems": ["id предмета"],
	"characteristics": [
		{
			"id": "id характеристики",
			"to": 0,
			"by": 0
		}
	]
}
```
addItems, removeItems и characteristics - необязательно указывать

Из to и by, можно указать только одно:

to - установить значение в.

by - изменить значение на.

Вопрос с вариантами ответа:
``` json
{
	"type": "question",
	"characterId": "id персонажа, который говорит",
	"characterImg": "Иконка персонажа: normal или sad или angry или happy",
	"text": "Вопрос персонажа",
	"actions": []
}
```
Содержимое actions:
``` json
{
	"text": "Действие",
	"conditions": {},
	"showConditions": {},
	"result": {
		"goToPart": "id части",
		"content": []
	}
}
```
conditions - условие для выбора этого варианта

showConditions - условие для показа этого варианта игроку

goToPart - переход к другой части

content - такое же поле как и в самом начале part.json, сюда можно написать несколько реплик, эффектов или даже вопросов, которые будут показаны при выборе этого варианта действия.

goToPart, content, conditions и showConditions - необязательно указывать

### Содержимое conditions и showConditions:
``` json
{
	"partsDone": [],
	"partsNotDone": [],
	"items": [],
	"characteristic": [
		{
			"id": "id характеристики",
			"lessThen": 0,
			"moreThen": 0
		}
	]
}
```
partsDone, partsNotDone, items, characteristic - необязательно указывать

partsDone - необходимые пройденые части

partsNotDone - необходимые не пройденые части

items - необходимые предметы

обходимо указать хотябы одно из lessThen и moreThen
