import * as vscode from "vscode";
import { v2 as cloudinary } from "cloudinary";
import {
  getCloudinaryConfigs,
  getCloudinaryFolder,
  getCloudinaryPublicId,
} from "./utils/configurations";
import { IMAGE_ACTIONS } from "./constants";

export interface Image {
  path: string;
}

export const uploadImage = async (
  args: Image,
  context: vscode.ExtensionContext
) => {
  try {
    if (!args || !args.path?.trim()) {
      throw new Error("No image to upload");
    }

    const configs = await getCloudinaryConfigs(context);

    if (!configs) {
      throw new Error("Cloudinary configurations are missing");
    }

    cloudinary.config({
      cloud_name: configs.cloudName,
      api_key: configs.apiKey,
      api_secret: configs.apiSecret,
    });

    const folder = await getCloudinaryFolder(context);

    const publicId = await getCloudinaryPublicId(context);

    const uploadResult = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
      },
      async (progress) => {
        progress.report({
          increment: 0,
          message: vscode.l10n.t("Uploading image..."),
        });
        const result = await cloudinary.uploader.upload(args.path, {
          public_id: publicId,
          folder,
        });
        progress.report({
          increment: 100,
        });

        return result;
      }
    );

    await uploadedResultActionHandler(uploadResult.secure_url);
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage(
      `Error uploading image: ${(error as Error).message}`
    );
  }
};

export const uploadedResultActionHandler = async (result: string) => {
  const actions = vscode.window.activeTextEditor
    ? [IMAGE_ACTIONS.INSERT_IMAGE, IMAGE_ACTIONS.COPY_URL]
    : [IMAGE_ACTIONS.COPY_URL];

  const followUpAnswer = await vscode.window.showInformationMessage(
    "Image saved successfully. What would you like to do next?",
    ...actions
  );

  if (followUpAnswer === "Insert to file") {
    const editor = vscode.window.activeTextEditor;
    editor?.edit((editBuilder: vscode.TextEditorEdit) => {
      // const lines = editor.document.lineCount;
      const line = editor.document.lineAt(0);
      editBuilder.insert(line.range.end, `\ncover_image: ${result}`);
    });
  } else if (followUpAnswer === "Copy URL") {
    await vscode.env.clipboard.writeText(result);
    vscode.window.showInformationMessage("Image URL copied to clipboard.");
  }
};
