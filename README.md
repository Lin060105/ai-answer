# AI Screenshot Helper

AI Screenshot Helper 是一個 Chrome 擴充功能，可以讓你在網頁上選取一塊畫面截圖，並把截圖和你的問題一起送到 Gemini Vision 進行分析。

這個專案不需要建置流程，下載後可以直接用 Chrome 的「載入未封裝項目」安裝。

## 功能

- 在網頁右下角顯示可拖曳的浮動 AI 面板。
- 支援選取網頁局部區域截圖。
- 可以輸入問題，搭配截圖送到 Gemini 分析。
- 可自訂 Gemini 模型名稱。
- Gemini API Key 只會儲存在本機 Chrome extension storage。
- 支援快捷鍵 `Ctrl+Shift+1` 開始截圖。

## 從零開始安裝

### 1. 下載專案

如果你熟悉 Git，可以使用：

```powershell
git clone https://github.com/你的帳號/你的repo.git
```

也可以在 GitHub 頁面點選 **Code**，再點 **Download ZIP**，下載後解壓縮。

### 2. 開啟 Chrome 擴充功能頁面

在 Chrome 網址列輸入：

```text
chrome://extensions
```

### 3. 開啟開發人員模式

在右上角打開 **開發人員模式**。

### 4. 載入未封裝項目

點選 **載入未封裝項目**，選擇這個專案資料夾。

請選擇包含 `manifest.json` 的那一層資料夾。

### 5. 設定 Gemini API Key

安裝完成後，打開任意一般網頁，右下角會出現 AI Screenshot Helper 的小按鈕。

打開面板後，在 **Gemini API 設定** 裡貼上你的 API Key，然後按 **儲存**。

如果你還沒有 API Key，請看這份教學：

[如何申請 Gemini API Key](docs/GEMINI_API_KEY.md)

### 6. 開始使用

1. 開啟任意一般網頁。
2. 點開右下角的 AI Screenshot Helper。
3. 按 **截圖**，或按快捷鍵 `Ctrl+Shift+1`。
4. 用滑鼠拖曳選取想分析的畫面區域。
5. 輸入你的問題。
6. 按 **送出**，等待 Gemini 回覆。

## Gemini 模型設定

預設模型是：

```text
gemini-flash-latest
```

如果你的 API Key 無法使用這個模型，可以在面板中的模型欄位改成其他可用模型，例如：

```text
gemini-2.5-flash
```

## 權限說明

這個擴充功能會要求以下權限：

- `activeTab`：在你主動截圖時，擷取目前分頁畫面。
- `storage`：在本機儲存 Gemini API Key 與模型名稱。
- `scripting`：讓擴充功能可以在網頁中顯示操作面板。
- `<all_urls>`：讓操作面板可以出現在一般網頁上。

## 隱私說明

Gemini API Key 只會儲存在 Chrome 的本機擴充功能儲存空間，也就是 `chrome.storage.local`。

這個專案不會把你的 API Key 存進程式碼，也不會上傳到 GitHub。

只有在你按下 **送出** 時，截圖內容與文字問題才會送到 Google Gemini API。

## 專案結構

```text
.
├── background.js
├── content.js
├── manifest.json
├── style.css
├── ui.html
├── README.md
├── LICENSE
└── docs/
    └── GEMINI_API_KEY.md
```

## 開發方式

這個專案沒有 build step。修改檔案後，到 `chrome://extensions` 按重新載入即可測試。

## License

本專案採用 MIT License。詳見 [LICENSE](LICENSE)。
