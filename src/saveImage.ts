import { Image, uploadedResultActionHandler } from "./uploadImage";
import * as vscode from "vscode";
import { downloadFile, getRandomFilename } from "./utils/saveFile";

export const saveImage = async (
  args: Image,
  context: vscode.ExtensionContext
) => {
  //get location to save image
  //save image to location
  try {
    const path = await vscode.window.showSaveDialog({
      filters: {
        Images: ["png", "jpg"],
      },
      title: getRandomFilename(),
    });

    if (!path) {
      return vscode.window.showErrorMessage(
        "No path selected to save the image."
      );
    }

    const saveResult = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
      },
      async (progress) => {
        progress.report({
          increment: 0,
          message: vscode.l10n.t("Saving image..."),
        });
        await downloadFile(args.path!, path?.path!);

        progress.report({
          increment: 100,
        });

        return path.path;
      }
    );

    await uploadedResultActionHandler(saveResult);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error while saving the image: ${(error as Error).message}`
    );
  }
};
