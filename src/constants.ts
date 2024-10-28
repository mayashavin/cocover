export const COMMANDS = {
  AGENT: "cocover.cover",
  UPLOAD: "cocover.upload",
  GENERATE_COVER: "image",
  SAVE: "cocover.save",
  GENERATE_COVER_FROM_SELECTION: "cocover.generateFromSelection",
} as const;

export const IMAGE_ACTIONS = {
  INSERT_IMAGE: "Insert to file",
  COPY_URL: "Copy URL to clipboard",
};
