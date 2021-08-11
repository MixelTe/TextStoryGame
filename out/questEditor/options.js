let Editor_Options = /** @class */ (() => {
    class Editor_Options {
    }
    Editor_Options.EnableEmotionSelect = false;
    Editor_Options.PrintNodeOption = false;
    Editor_Options.DownloadQuestOption = false;
    return Editor_Options;
})();
export { Editor_Options };
let dev = false;
window.toogleDev = (v) => {
    if (typeof v == "boolean")
        dev = v;
    else
        dev = !dev;
    Editor_Options.PrintNodeOption = dev;
    Editor_Options.DownloadQuestOption = dev;
};
