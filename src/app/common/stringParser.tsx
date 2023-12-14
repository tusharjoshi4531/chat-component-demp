export const replaceBreakTags = (str: string) =>
    str.replace(/<br\s*\/?>/gm, " ");

export const removeHtmlTags = (str: string) => str.replace(/<[^>]*>?/gm, "");
