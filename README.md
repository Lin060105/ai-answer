# AI Screenshot Helper

AI Screenshot Helper is a Manifest V3 Chrome extension that lets you capture a selected area of the current page and send it to Gemini Vision with your own prompt.

## Features

- Floating Shadow DOM panel that works on ordinary web pages.
- Area screenshot capture with an on-page crop overlay.
- Gemini model name configuration.
- Gemini API key stored locally in `chrome.storage.local`.
- Keyboard shortcut: `Ctrl+Shift+1` starts capture.

## Installation

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this project folder.
6. Open any normal webpage and use the floating AI helper button.

## Usage

1. Open the extension panel.
2. Enter your Gemini API key.
3. Optionally change the model name. The default is `gemini-flash-latest`.
4. Click **截圖** or press `Ctrl+Shift+1`.
5. Drag to select an area of the page.
6. Enter a question or instruction, then send it to Gemini.

## Permissions

This extension requests:

- `activeTab`: capture the currently active tab when you start the capture flow.
- `storage`: save your Gemini API key and model name locally in Chrome.
- `scripting`: support extension interaction with the active page.
- `<all_urls>`: inject the helper panel and capture workflow on ordinary webpages.

## Privacy

Your Gemini API key is stored only in Chrome local extension storage. It is not committed to this repository and is not sent anywhere except to the Google Gemini API request that you initiate.

Captured image data and prompt text are sent to the Gemini API only when you click the send button.

## Development

This project has no build step. Edit the files directly and reload the extension from `chrome://extensions`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
