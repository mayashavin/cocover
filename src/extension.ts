// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { COMMANDS } from "./constants";
import { generateCover } from "./generateCover";
import { Image, uploadImage } from "./uploadImage";
import { saveImage } from "./saveImage";
import { initTelemetry } from "./utils/telemetry";
import TelemetryReporter from "@vscode/extension-telemetry";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(exContext: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "cocover" is now active!');

  const reporter = initTelemetry();

  const handler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ) => {
    if (request.command === COMMANDS.GENERATE_COVER) {
      //TODO - History?
      //TODO - Let user configure what
      (reporter as TelemetryReporter)?.sendTelemetryEvent("generateCover");
      await generateCover(request, exContext, stream, token);
    } else {
      stream.markdown(
        "Please use the command `/image` to generate a cover image."
      );
      (reporter as TelemetryReporter)?.sendTelemetryErrorEvent(
        "generateCoverError"
      );
    }
  };

  const agent = vscode.chat.createChatParticipant(COMMANDS.AGENT, handler);

  agent.iconPath = vscode.Uri.joinPath(exContext.extensionUri, "CoCover.png");

  exContext.subscriptions.push(agent);

  const uploadDisposable = vscode.commands.registerCommand(
    COMMANDS.UPLOAD,
    async (args: Image) => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      (reporter as TelemetryReporter)?.sendTelemetryEvent(
        "uploadImageCloudinary"
      );
      await uploadImage(args, exContext);
    }
  );

  const saveDisposable = vscode.commands.registerCommand(
    COMMANDS.SAVE,
    async (args: Image) => {
      // The code you place here
      (reporter as TelemetryReporter)?.sendTelemetryEvent("saveLocalFile");
      await saveImage(args, exContext);
    }
  );

  exContext.subscriptions.push(uploadDisposable);
  exContext.subscriptions.push(saveDisposable);
  exContext.subscriptions.push(reporter!);
}

// This method is called when your extension is deactivated
export function deactivate() {}
