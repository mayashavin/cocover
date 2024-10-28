# CoCover AI - GitHub Copilot Extension

<img src="./Cocover.png" height=64 style="margin:auto; display:block;"/>

Your AI Assistant that helps to enhance your markdown content with generated professional cover images and SEO-optimized titles, saving your valuable time and improving your content's quality.

Leverage GPT-4o and Dall-E 3 to generate cover images based on your markdown content's title and description. You can then upload the generated cover image to Cloudinary and insert the image URL to your markdown file.

## Requirements

- GitHub Copilot extension installed. (with GPT-4o model recommended)
- OpenAI Subscription for Dall-E 3 image generation. You need to provide API Key when generating cover images.
- Cloudinary account (_optional_). You will need to provide your key, Client Secret, and Cloud Name when uploading the generated cover image to Cloudinary.

## Features

CoCover AI extension provides the following features:

### Cover Image Generation

1. Copy the title/description content of your post as attachment to the chat using CoPilot's context menu "Add Selection to Chat".
2. Generate cover image based on the title and description of your markdown content using the command `@cocover /image` in the GitHub Copilot Chat. You can provide any customization prompt to the command.
   ![Demo of generating image from selected text](https://res.cloudinary.com/mayashavin/image/upload/v1730116072/cocover/demo_cocover_1.gif)
3. Save the generated cover image to your local project, or upload to your Cloudinary account.
4. Insert the generated cover image's URL to your markdown file as part of the content header (follow the YAML standard as `cover_image` field).

#### Demo using Cloudinary

![Demo of uploading the generated image to Cloudinary](https://res.cloudinary.com/mayashavin/image/upload/v1730116064/cocover/cocover_cloudinary.gif)

Full flow of generating cover image and uploading to Cloudinary:

![Full flow of generating cover image and uploading to Cloudinary](https://res.cloudinary.com/mayashavin/image/upload/v1730116064/cocover/full_flow_cloudinary.gif)

#### Demo using Local Save

![Demo of saving the generated image locally](https://res.cloudinary.com/mayashavin/image/upload/v1730116064/cocover/fullflow_save.gif)

### Fix SEO content issues

- Coming soon!

## Extension Settings

This extension contributes the following settings:

- `cocover.enable`: Enable/disable this extension.

## Known Issues

TBD

## Release Notes

Below are the list of versions and their release notes for CoCover AI extension.

### 0.0.1

Initial release of CoCover with the first feature of generating cover images.

## Disclaimer

- There is no guarantee that the extension will continue to work as-is without any issues or side-effects. Please use it at your own risk.
- This extension never uses/stores your personally identifiable information.
- We assume no responsibility of any issues that you may face using this extension. Your use of OpenAI services is subject to OpenAI's Privacy Policy and Terms of Use.
- If you would like to help us improve our features please enable the telemetry in the settings. It's disabled by default but if you enable it, it will start collecting metadata to improve its features. No personally identifiable information is collected. You can opt-out from telemetry either by setting the global 'telemetry.telemetryLevel' or by setting 'cocover.telemetry.disable' to true(Disabled by default).
- The extension will respect both of these settings and will collect metadata only if both allow telemetry. We use the official telemetry package provided by the vscode team here to understand this extension's usage patterns to better plan new feature releases.
- 💻 OpenAI: <https://openai.com/>
