# Ulearn 使用示範

這份文件示範如何在 Ulearn 頁面中使用 AI Screenshot Helper 截圖並詢問 Gemini。

> [!IMPORTANT]
> 本軟體僅供教育研究用途。使用者需自行確認使用情境是否合法、是否符合學校或平台規範，並自行承擔使用本工具所產生的責任。

## 使用前準備

請先完成：

- [安裝 AI Screenshot Helper](../README.md#從零開始安裝)
- [申請並設定 Gemini API Key](GEMINI_API_KEY.md)

## 1. 開啟 Ulearn 頁面

進入你要閱讀或分析的 Ulearn 頁面，確認右下角有 AI Screenshot Helper 的浮動按鈕。

![開啟 Ulearn 頁面](../Sample%20image/step甲.jpg)

## 2. 點開 AI Screenshot Helper

點開右下角的浮動按鈕，確認面板可以正常顯示。

![開啟 AI Screenshot Helper 面板](../Sample%20image/step乙.jpg)

## 3. 選取要分析的畫面

按下 **截圖**，或使用快捷鍵 `Ctrl+Shift+1`，然後用滑鼠拖曳選取想分析的區域。

建議只選取你需要分析的範圍，不要截整個頁面，這樣 Gemini 比較容易理解重點，也比較不容易遇到 token 或內容過長問題。

![框選 Ulearn 畫面](../Sample%20image/step丙.jpg)

## 4. 輸入問題並送出

在輸入框中寫下你想問 Gemini 的問題，然後按 **送出**。

例如：

```text
請幫我整理這段內容的重點。
```

![送出問題給 Gemini](../Sample%20image/step丁.jpg)

## 使用建議

- 截圖範圍越精準，回覆通常越準確。
- 如果回覆不完整，可以縮小截圖範圍後重新提問。
- 不要把個人資料、帳號資訊或敏感內容截圖送出。
- 使用前請確認你的使用方式符合學校、課程或平台規範。
