import { OpenAI } from "openai";
import * as vscode from "vscode";
import { cleanPrompt } from "./utils/cleanText";
import { getProgressMessage } from "./utils/promptUtils";
import { getOpenAIKey } from "./utils/configurations";
import { COMMANDS } from "./constants";
import { saveAndResizeTempImage } from "./utils/saveFile";

const LANGUAGE_MODEL_FAMILY = "gpt-4o";
export const generateCover = async (
  request: vscode.ChatRequest,
  context: vscode.ExtensionContext,
  chatContext: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
) => {
  try {
    const reference = request.references[0]?.value;
    const selectedText = reference
      ? await vscode.window.activeTextEditor?.document.getText(
          (reference as vscode.Location).range
        )
      : "";
    const hasPrompt = request.prompt?.trim() || selectedText?.trim();
    if (!hasPrompt) {
      throw new Error("Prompt is required to generate the image.");
    }

    const models = await vscode.lm.selectChatModels({
      family: LANGUAGE_MODEL_FAMILY,
    })!;

    if (!models || models.length === 0) {
      throw new Error("No models available to generate the image.");
    }

    stream.progress(getProgressMessage());

    const prompt = `${request.prompt || ""}\n${selectedText || ""}`;

    const cleanUserPrompt = await getImprovedPrompt(
      prompt!,
      models[0],
      chatContext,
      token
    );

    stream.progress(getProgressMessage());

    const { short, full } = await askDallE(context, cleanUserPrompt);

    stream.progress("Displaying the generated image...");

    embeddedImage({ short, full }, stream);

    stream.button({
      command: COMMANDS.SAVE,
      title: vscode.l10n.t("Save image"),
      arguments: [{ path: full }],
    });
    stream.button({
      command: COMMANDS.UPLOAD,
      title: vscode.l10n.t("Upload to Cloudinary"),
      arguments: [{ path: full }],
    });
  } catch (error) {
    console.error(error);
    const content = `An error occurred while generating the image: ${
      (error as Error).message
    }`;
    stream.markdown(content);
  }
};

export const getImprovedPrompt = async (
  userPrompt: string,
  model: vscode.LanguageModelChat,
  chatContext: vscode.ChatContext,
  token: vscode.CancellationToken
) => {
  const cleanUserPrompt = cleanPrompt(userPrompt);
  const promptRequest = await model.sendRequest(
    [
      new vscode.LanguageModelChatMessage(
        vscode.LanguageModelChatMessageRole.Assistant,
        "You write creative prompts for an AI blog cover image generator. The user will give a title and description, and you must generate a prompt for DALL-E based on that phrase."
      ),
      new vscode.LanguageModelChatMessage(
        vscode.LanguageModelChatMessageRole.User,
        cleanUserPrompt
      ),
    ],
    // messages,
    {},
    token
  );

  let prompt = "";
  for await (const chunk of promptRequest.text) {
    prompt += chunk;
  }

  return prompt;
};

export const askDallE = async (
  context: vscode.ExtensionContext,
  prompt: string
) => {
  const apiKey = await getOpenAIKey(context);
  const openai = new OpenAI({
    apiKey,
  });

  const imageGen = await openai.images.generate({
    prompt,
    model: "dall-e-3",
    n: 1,
    size: "1792x1024", //TODO - Let user configure image size
    quality: "hd",
  });

  const result = imageGen.data;

  console.log(result);

  const short = await saveAndResizeTempImage(result[0].url!);
  return {
    short,
    full: result[0].url!,
  };
};

export const embeddedImage = (
  imagePath: { short: string; full: string },
  stream: vscode.ChatResponseStream
) => {
  const content = `Here is the generated image:

  ![image](file://${imagePath.short})

  [Full size](${imagePath.full})
  `;
  stream.markdown(content);
};
