import * as vscode from "vscode";

export const getConfiguration = () =>
  vscode.workspace.getConfiguration("cocover");

export const getApiKey = () => getConfiguration().get("apiKey") as string;

export const getApiUrl = () => getConfiguration().get("apiUrl") as string;

export async function getOpenAIKey(
  context: vscode.ExtensionContext
): Promise<string | undefined> {
  const storedKey = await context.secrets.get("openai.key");

  if (storedKey) {
    return storedKey;
  }

  const newKey = await vscode.window.showInputBox({
    placeHolder: "Enter your OpenAI API key",
    prompt:
      "You can create an API key [here](https://platform.openai.com/api-keys)",
  });
  if (newKey) {
    context.secrets.store("openai.key", newKey);
    return newKey;
  } else {
    return;
  }
}

export async function getCloudinaryConfigs(context: vscode.ExtensionContext) {
  let cloudName = await context.secrets.get("cloudinary.cloud_name");
  let apiKey = await context.secrets.get("cloudinary.api_key");
  let apiSecret = await context.secrets.get("cloudinary.api_secret");

  if (cloudName && apiKey && apiSecret) {
    return {
      cloudName,
      apiKey,
      apiSecret,
    };
  }

  if (!cloudName) {
    cloudName = await vscode.window.showInputBox({
      title: "Your Cloudinary's Cloud Name",
      placeHolder: "Enter your Cloud Name",
      prompt:
        "You can create an Cloudinary account [here](https://cloudinary.com)",
      validateInput: (value) =>
        value && value.trim() ? "" : "CloudName is required",
    });
  }

  if (!apiKey) {
    apiKey = await vscode.window.showInputBox({
      placeHolder: "Enter your Cloudinary API Key",
      title: "Cloudinary API Key",
      password: true,
      validateInput: (value) =>
        value && value.trim() ? "" : "API Key is required",
    });
  }

  if (!apiSecret) {
    apiSecret = await vscode.window.showInputBox({
      placeHolder: "Enter your Cloudinary API Secret",
      title: "Cloudinary API Secret",
      password: true,
      validateInput: (value) =>
        value && value.trim() ? "" : "API Secret is required for uploading",
    });
  }

  if (cloudName && apiKey && apiSecret) {
    context.secrets.store("cloudinary.cloud_name", cloudName);
    context.secrets.store("cloudinary.api_key", apiKey);
    context.secrets.store("cloudinary.api_secret", apiSecret);
    return {
      cloudName,
      apiKey,
      apiSecret,
    };
  } else {
    return;
  }
}

export async function getCloudinaryFolder(context: vscode.ExtensionContext) {
  const folder = (await context.workspaceState.get(
    "cloudinary.folder"
  )) as string;

  const newFolder = await vscode.window.showInputBox({
    placeHolder: "Enter the folder to upload the image",
    title: "Image folder to upload",
    value: folder,
  });

  context.workspaceState.update("cloudinary.folder", newFolder);

  return newFolder;
}

export async function getCloudinaryPublicId(context: vscode.ExtensionContext) {
  const publicId = (await context.workspaceState.get(
    "cloudinary.publicId"
  )) as string;

  const newPublicId = await vscode.window.showInputBox({
    placeHolder: "Enter the name for the image",
    value: publicId,
    title: "Image file name",
    validateInput: (value) => (value && value.trim() ? "" : "Name is required"),
  });

  context.workspaceState.update("cloudinary.publicId", newPublicId);

  return newPublicId;
}
