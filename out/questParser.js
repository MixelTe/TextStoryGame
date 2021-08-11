export function parseQuest(content) {
    const quest = JSON.parse(content);
    if (typeof quest.name != "string")
        throw new Error('quest.name must be string');
    if (typeof quest.description != "string")
        quest.description = "";
    if (typeof quest.hasImg != "boolean")
        quest.hasImg = false;
    return quest;
}
export function parseCharacters(content) {
    const characters = JSON.parse(content);
    characters.forEach((ch, i) => {
        if (typeof ch.id != "string")
            throw new Error(`characters[${i}].id must be string`);
        if (typeof ch.name != "string")
            throw new Error(`characters[${i}].name must be string`);
        if (typeof ch.description != "string")
            ch.description = "";
        if (typeof ch.friendLevel != "number")
            throw new Error(`characters[${i}].name must be number`);
        if (typeof ch.hasImg != "boolean")
            ch.hasImg = false;
    });
    return characters;
}
export function parseItems(content) {
    const items = JSON.parse(content);
    items.forEach((item, i) => {
        if (typeof item.id != "string")
            throw new Error(`items[${i}].id must be string`);
        if (typeof item.name != "string")
            throw new Error(`items[${i}].name must be string`);
        if (typeof item.description != "string")
            item.description = "";
        if (typeof item.hasImg != "boolean")
            item.hasImg = false;
    });
    return items;
}
export function parsePlayer(content) {
    const player = JSON.parse(content);
    if (typeof player.items != "object")
        player.items = [];
    player.items.forEach((el, i) => {
        if (typeof el != "string")
            throw new Error(`player.items[${i}] element must be string`);
    });
    if (typeof player.characteristics != "object")
        player.characteristics = [];
    player.characteristics.forEach((el, i) => {
        if (typeof el.id != "string")
            throw new Error(`player.characteristics[${i}].id must be string`);
        if (typeof el.name != "string")
            throw new Error(`player.characteristics[${i}].name must be string`);
        if (typeof el.description != "string")
            el.description = "";
        if (typeof el.value != "number")
            throw new Error(`player.characteristics[${i}].name must be number`);
        if (typeof el.loseIfBelowZero != "boolean")
            el.loseIfBelowZero = false;
        if (typeof el.loseText != "string")
            el.loseText = "";
        if (typeof el.hasLoseImg != "boolean")
            el.hasLoseImg = false;
        if (typeof el.hidden != "boolean")
            el.hidden = false;
    });
}
export function parseAchievements(content) {
    const achievements = JSON.parse(content);
    achievements.forEach((el, i) => {
        if (typeof el.id != "string")
            throw new Error(`achievements[${i}].id must be string`);
        if (typeof el.name != "string")
            throw new Error(`achievements[${i}].name must be string`);
        if (typeof el.description != "string")
            el.description = "";
    });
    return achievements;
}
export function parseChapters(content) {
    const chapters = JSON.parse(content);
    if (typeof chapters != "object")
        throw new Error('chapters must be object');
    chapters.forEach((chapter, i) => {
        if (typeof chapter != "object")
            throw new Error(`chapters[${i}] must be object`);
        if (typeof chapter.name != "string")
            throw new Error(`chapters[${i}].name must be string`);
        if (typeof chapter.partsCount != "number")
            throw new Error(`chapters[${i}].partsCount must be number`);
    });
    return chapters;
}
export function parseChapterPart(content) {
    const part = JSON.parse(content);
    if (typeof part.id != "string")
        throw new Error('part.id must be string');
    if (typeof part.backImg != "string")
        part.backImg = "";
    if (typeof part.content != "object")
        throw new Error('part.content must be object');
    checkContent(part.content);
    return part;
}
function checkContent(content) {
    content.forEach(el => {
        const errorText = `part.content[].type must be "speech", "question", "effect", "change" or "splitter"`;
        if (typeof el.type != "string")
            throw new Error(errorText);
        switch (el.type) {
            case "speech":
                checkContent_speech(el);
                break;
            case "question":
                checkContent_question(el);
                break;
            case "effect":
                checkContent_effect(el);
                break;
            case "change":
                checkContent_change(el);
                break;
            case "splitter":
                checkContent_splitter(el);
                break;
            default: throw new Error(errorText);
        }
    });
}
function checkContent_speech(content) {
    const error = (text) => {
        throw new Error(`part.content[].${text}`);
    };
    const errorText = `characterImg must be "normal", "sad", "angry" or "happy"`;
    if (typeof content.text != "string")
        error(`text must be string`);
    if (typeof content.character != "string")
        content.character = "author";
    if (typeof content.characterImg != "string")
        content.characterImg = "normal";
    if (content.characterImg != "normal" && content.characterImg != "sad" &&
        content.characterImg != "angry" && content.characterImg != "happy") {
        error(errorText);
    }
}
function checkContent_question(content) {
    const error = (text) => {
        throw new Error(`part.content[].${text}`);
    };
    checkContent_speech(content);
    if (typeof content.actions != "object")
        error(`actions must be list`);
    checkActions(content.actions);
}
function checkContent_effect(content) {
    const error = (text) => {
        throw new Error(`part.content[].${text}`);
    };
    const errorText = `effectName must be "darkScreen", "whiteScreen" or "shake"`;
    if (typeof content.duraction != "number")
        error(`duraction must be number`);
    if (typeof content.effectName != "string")
        error(errorText);
    if (content.effectName != "darkScreen" && content.effectName != "whiteScreen" && content.effectName != "shake") {
        error(errorText);
    }
}
function checkContent_change(content) {
    const error = (text) => {
        throw new Error(`part.content[].${text}`);
    };
    if (typeof content.characteristics == "object") {
        content.characteristics.forEach((el2, j) => {
            if (typeof el2 != "object")
                error(`characteristics[${j}] must be object`);
            if (typeof el2.id != "string")
                error(`characteristics[${j}].id must be string`);
            if (typeof el2.by != "number" && typeof el2.to != "number") {
                error(`characteristics[${j}].by or .to must be number`);
            }
        });
    }
    if (typeof content.achievements == "object") {
        content.achievements.forEach((el, j) => {
            if (typeof el != "string")
                error(`achievements[${j}] must be string`);
        });
    }
    if (typeof content.addItems == "object") {
        content.addItems.forEach((el, j) => {
            if (typeof el != "string")
                error(`addItems[${j}] must be string`);
        });
    }
    if (typeof content.removeItems == "object") {
        content.removeItems.forEach((el, j) => {
            if (typeof el != "string")
                error(`addItems[${j}] must be string`);
        });
    }
}
function checkContent_splitter(content) {
    const error = (text) => {
        throw new Error(`part.content[].${text}`);
    };
    if (typeof content.conditions != "object")
        error(`conditions must be object`);
    checkCondition(content.conditions, "conditions", error);
}
function checkActions(content) {
    const error = (text) => {
        throw new Error(`part.content[].actions[].${text}`);
    };
    content.forEach(el => {
        if (typeof el.text != "string")
            error(`text must be string`);
        if (typeof el.conditions == "object")
            checkCondition(el.conditions, "conditions", error);
        if (typeof el.showConditions == "object")
            checkCondition(el.showConditions, "showConditions", error);
    });
}
function checkCondition(cond, n, error) {
    if (typeof cond.partsDone == "object") {
        cond.partsDone.forEach((el, j) => {
            if (typeof el != "string")
                error(`${n}.partsDone[${j}] must be string`);
        });
    }
    else {
        cond.partsDone = [];
    }
    if (typeof cond.partsNotDone == "object") {
        cond.partsDone.forEach((el, j) => {
            if (typeof el != "string")
                error(`${n}.partsNotDone[${j}] must be string`);
        });
    }
    else {
        cond.partsNotDone = [];
    }
    if (typeof cond.characteristics == "object") {
        cond.characteristics.forEach((el, j) => {
            if (typeof el != "object")
                error(`${n}.characteristics[${j}] must be object`);
            if (typeof el.id != "string")
                error(`${n}.characteristics[${j}].id must be string`);
            if (typeof el.lessThen != "number" && typeof el.moreThen != "number") {
                error(`${n}.characteristics[${j}].lessThen or .moreThen must be number`);
            }
        });
    }
    else {
        cond.characteristics = [];
    }
    if (typeof cond.items == "object") {
        cond.items.forEach((el, j) => {
            if (typeof el != "string")
                error(`${n}.items[${j}] must be string`);
        });
    }
    else {
        cond.items = [];
    }
    if (typeof cond.itemsNot == "object") {
        cond.itemsNot.forEach((el, j) => {
            if (typeof el != "string")
                error(`${n}.itemsNot[${j}] must be string`);
        });
    }
    else {
        cond.itemsNot = [];
    }
}
