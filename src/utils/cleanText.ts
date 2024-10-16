const reg =
  /(^|\s)\[(#)([\w_\-]+)(:[\w_\-\.]+)?\]\(values:([\w_\-]+)(:[\w_\-\.]+)?\)/gi;

export const cleanPrompt = (prompt: string) => prompt.replace(reg, "");
