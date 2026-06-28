# 如何申請 Gemini API Key

這份教學會帶你從零開始申請 Gemini API Key，並把它填入 AI Screenshot Helper。

> [!WARNING]
> 請不要把自己的 API Key 公開到 GitHub、社群網站、教學截圖或任何公開地方。API Key 可能會產生用量與費用，請妥善保管。

## 事前準備

你需要：

- 一個 Google 帳號
- Chrome 瀏覽器
- 可以使用 Google AI Studio 的網路環境

## 1. 開啟 Google AI Studio

前往 Google AI Studio：

[https://aistudio.google.com/](https://aistudio.google.com/)

登入你的 Google 帳號。

在 Google AI Studio 中，找到 **API key** 後點選 **Create API keys**。

![開啟 Google AI Studio](../Sample%20image/step1.jpg)

## 2. 新增 Project

點選 **Create project** ，這樣方便查看消耗多少token。

![進入 API Key 頁面](../Sample%20image/step2.jpg)

## 3. 設定 Project 名稱

輸入 **Projec** 的名稱，這裡使用 **example** 當範例。

![建立新的 API Key](../Sample%20image/step3.jpg)

## 4. 選擇 Project 並設定 API Key 的名稱

點選剛才建立的 Project ， 並且輸入 API Key 的名稱。

![選擇 Google Cloud 專案](../Sample%20image/step4.jpg)

## 5. 複製 API Key

建立完成後，你會看到一串 API Key。複製這組金鑰。

![複製 Gemini API Key](../Sample%20image/step5.jpg)

如果點掉了想再看 API Key，可以從這裡點就可以複製了。

![完成 API Key 建立](../Sample%20image/step5-1.jpg)

## 6. 貼到 AI Screenshot Helper

1. 回到 Chrome。
2. 打開任意一般網頁。
3. 點開右下角的 AI Screenshot Helper 面板。
4. 展開 **Gemini API 設定**。
5. 將 API Key 貼到輸入框。
6. 按 **儲存**。

完成後就可以截圖並送出問題。

## 7. 測試是否成功

你可以先選取一小塊網頁畫面，然後輸入：

```text
請描述這張截圖裡有什麼。
```

如果 Gemini 正常回覆，代表 API Key 設定成功。

## 常見問題

### 出現模型不存在或不支援

請嘗試把模型名稱改成：

```text
gemini-2.5-flash
```

或回到 Google AI Studio 確認你的 API Key 可用的模型。

### 出現 API Key 錯誤

請確認：

- API Key 沒有多複製空白或換行。
- API Key 沒有被刪除或停用。
- 你的 Google 帳號與專案可以使用 Gemini API。

### 需要付費嗎

Gemini API 的免費額度與計費方式可能會變動，請以 Google 官方頁面為準。

在公開專案中，不要提供自己的 API Key 給其他人使用。
