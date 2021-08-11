export class Editor_Options
{
	public static EnableEmotionSelect = false;
	public static PrintNodeOption = false;
	public static DownloadQuestOption = false;
}

declare global
{
	interface Window
	{
		toogleDev: (v?: boolean) => void,
	}
}
let dev = false;
window.toogleDev = (v?: boolean) =>
{
	if (typeof v == "boolean") dev = v;
	else dev = !dev;
	Editor_Options.PrintNodeOption = dev;
	Editor_Options.DownloadQuestOption = dev;
}