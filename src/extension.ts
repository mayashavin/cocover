// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { COMMANDS } from "./constants";
import { generateCover } from "./generateCover";
import { Image, uploadImage } from "./uploadImage";
import { saveImage } from "./saveImage";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(exContext: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "cocover" is now active!');

  const handler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ) => {
    if (request.command === COMMANDS.GENERATE_COVER) {
      //TODO - History?
      //TODO - Let user configure what
      await generateCover(request, exContext, stream, token);
    } else {
      stream.markdown(
        "Please use the command `/cover` to generate a cover image."
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
      await uploadImage(args, exContext);
    }
  );

  const saveDisposable = vscode.commands.registerCommand(
    COMMANDS.SAVE,
    async (args: Image) => {
      // The code you place here
      await saveImage(args, exContext);
    }
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "cocover.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from CoCover!");
    }
  );

  exContext.subscriptions.push(disposable);
  exContext.subscriptions.push(uploadDisposable);
  exContext.subscriptions.push(saveDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
