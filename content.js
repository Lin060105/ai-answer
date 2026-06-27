(() => {
  const ROOT_ID = "ai-helper-shadow-host";
  const MESSAGE_TYPES = {
    CAPTURE_VISIBLE_TAB: "AI_HELPER_CAPTURE_VISIBLE_TAB",
    START_CAPTURE: "AI_HELPER_START_CAPTURE"
  };
  const STORAGE_KEYS = {
    API_KEY: "geminiApiKey",
    MODEL_NAME: "geminiModelName"
  };
  const DEFAULT_MODEL_NAME = "gemini-flash-latest";
  const SYSTEM_PROMPT = "You are a concise visual analysis assistant. Answer based on the user's screenshot and question. If the image is unclear, say what is missing.";

  let shadowRoot = null;
  let panel = null;
  let body = null;
  let chatLog = null;
  let preview = null;
  let previewImage = null;
  let promptInput = null;
  let captureButton = null;
  let sendButton = null;
  let apiKeyInput = null;
  let modelInput = null;
  let saveKeyButton = null;
  let saveModelButton = null;
  let keyStatus = null;
  let collapseButton = null;
  let croppedImageDataUrl = "";
  let isDraggingPanel = false;
  let didMovePanel = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  if (document.getElementById(ROOT_ID)) {
    return;
  }

  init().catch((error) => {
    console.error("[AI Screenshot Helper] Failed to initialize.", error);
  });

  async function init() {
    await createShadowUi();
    bindUiEvents();
    await restoreSettings();
    setPanelMinimized(true);
    addMessage("system", "請先設定 Gemini API Key。完成後可以截圖並詢問 Gemini。");
  }

  async function createShadowUi() {
    const host = document.createElement("div");
    host.id = ROOT_ID;
    host.style.position = "fixed";
    host.style.inset = "0";
    host.style.pointerEvents = "none";
    host.style.zIndex = "2147483647";
    document.documentElement.appendChild(host);

    shadowRoot = host.attachShadow({ mode: "open" });

    const [styleText, uiHtml] = await Promise.all([
      fetch(chrome.runtime.getURL("style.css")).then((response) => response.text()),
      fetch(chrome.runtime.getURL("ui.html")).then((response) => response.text())
    ]);

    const style = document.createElement("style");
    style.textContent = styleText;
    shadowRoot.appendChild(style);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = uiHtml;
    shadowRoot.appendChild(wrapper);

    panel = shadowRoot.querySelector(".ai-helper-panel");
    body = shadowRoot.getElementById("aiHelperBody");
    chatLog = shadowRoot.getElementById("aiHelperChatLog");
    preview = shadowRoot.getElementById("aiHelperPreview");
    previewImage = shadowRoot.getElementById("aiHelperPreviewImage");
    promptInput = shadowRoot.getElementById("aiHelperPromptInput");
    captureButton = shadowRoot.getElementById("aiHelperCaptureButton");
    sendButton = shadowRoot.getElementById("aiHelperSendButton");
    apiKeyInput = shadowRoot.getElementById("aiHelperApiKeyInput");
    modelInput = shadowRoot.getElementById("aiHelperModelInput");
    saveKeyButton = shadowRoot.getElementById("aiHelperSaveKeyButton");
    saveModelButton = shadowRoot.getElementById("aiHelperSaveModelButton");
    keyStatus = shadowRoot.getElementById("aiHelperKeyStatus");
    collapseButton = shadowRoot.getElementById("aiHelperCollapseButton");

    panel.style.pointerEvents = "auto";
  }

  function bindUiEvents() {
    const titlebar = shadowRoot.querySelector("[data-drag-handle]");
    titlebar.addEventListener("mousedown", startPanelDrag);
    window.addEventListener("mousemove", movePanel);
    window.addEventListener("mouseup", stopPanelDrag);

    captureButton.addEventListener("click", startCaptureFlow);
    sendButton.addEventListener("click", sendToGemini);
    saveKeyButton.addEventListener("click", saveApiKey);
    saveModelButton.addEventListener("click", saveModelName);
    collapseButton.addEventListener("click", handleCollapseButtonClick);

    chrome.runtime.onMessage.addListener((message) => {
      if (message && message.type === MESSAGE_TYPES.START_CAPTURE) {
        startCaptureFlow();
      }
    });
  }

  function startPanelDrag(event) {
    const isMinimized = panel.classList.contains("is-minimized");
    if (event.button !== 0 || (!isMinimized && event.target.closest("button"))) {
      return;
    }

    const rect = panel.getBoundingClientRect();
    isDraggingPanel = true;
    didMovePanel = false;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragOffsetX = event.clientX - rect.left;
    dragOffsetY = event.clientY - rect.top;

    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.top}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    event.preventDefault();
  }

  function movePanel(event) {
    if (!isDraggingPanel) {
      return;
    }

    if (Math.abs(event.clientX - dragStartX) > 3 || Math.abs(event.clientY - dragStartY) > 3) {
      didMovePanel = true;
    }

    const rect = panel.getBoundingClientRect();
    const maxLeft = Math.max(0, window.innerWidth - rect.width);
    const maxTop = Math.max(0, window.innerHeight - rect.height);
    const nextLeft = clamp(event.clientX - dragOffsetX, 0, maxLeft);
    const nextTop = clamp(event.clientY - dragOffsetY, 0, maxTop);

    panel.style.left = `${nextLeft}px`;
    panel.style.top = `${nextTop}px`;
  }

  function stopPanelDrag() {
    isDraggingPanel = false;
  }

  function handleCollapseButtonClick(event) {
    if (didMovePanel) {
      event.preventDefault();
      event.stopPropagation();
      didMovePanel = false;
      return;
    }

    togglePanelSize();
  }

  function togglePanelSize() {
    setPanelMinimized(!panel.classList.contains("is-minimized"));
  }

  function setPanelMinimized(isMinimized) {
    panel.classList.toggle("is-minimized", isMinimized);
    body.classList.toggle("is-collapsed", isMinimized);
    collapseButton.textContent = isMinimized ? "" : "-";
    collapseButton.setAttribute("aria-label", isMinimized ? "Open AI Screenshot Helper" : "Minimize AI Screenshot Helper");
    collapseButton.title = isMinimized ? "Open" : "Minimize";
  }

  async function restoreSettings() {
    const stored = await chrome.storage.local.get([STORAGE_KEYS.API_KEY, STORAGE_KEYS.MODEL_NAME]);
    if (stored[STORAGE_KEYS.API_KEY]) {
      apiKeyInput.value = stored[STORAGE_KEYS.API_KEY];
    }

    modelInput.value = stored[STORAGE_KEYS.MODEL_NAME] || DEFAULT_MODEL_NAME;
    keyStatus.textContent = stored[STORAGE_KEYS.API_KEY]
      ? "已載入儲存的 API Key。"
      : `預設模型：${DEFAULT_MODEL_NAME}`;
  }

  async function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      keyStatus.textContent = "請先輸入 API Key。";
      return;
    }

    await chrome.storage.local.set({ [STORAGE_KEYS.API_KEY]: apiKey });
    keyStatus.textContent = "API Key 已儲存。";
  }

  async function saveModelName() {
    const modelName = normalizeModelName(modelInput.value);
    modelInput.value = modelName;
    await chrome.storage.local.set({ [STORAGE_KEYS.MODEL_NAME]: modelName });
    keyStatus.textContent = `模型已設定為 ${modelName}。`;
  }

  async function startCaptureFlow() {
    setButtonBusy(captureButton, true, "截圖中...");

    try {
      const response = await chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.CAPTURE_VISIBLE_TAB
      });

      if (!response || !response.ok) {
        throw new Error(response && response.error ? response.error : "無法擷取目前分頁。");
      }

      await openCropOverlay(response.dataUrl);
    } catch (error) {
      addMessage("error", `截圖失敗：${error.message}`);
    } finally {
      setButtonBusy(captureButton, false, "截圖");
    }
  }

  function openCropOverlay(fullPageDataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const deviceRatio = window.devicePixelRatio || 1;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isSelecting = false;

        canvas.width = Math.round(viewportWidth * deviceRatio);
        canvas.height = Math.round(viewportHeight * deviceRatio);
        canvas.style.background = "rgba(15, 23, 42, 0.28)";
        canvas.style.cursor = "crosshair";
        canvas.style.inset = "0";
        canvas.style.position = "fixed";
        canvas.style.width = `${viewportWidth}px`;
        canvas.style.height = `${viewportHeight}px`;
        canvas.style.zIndex = "2147483647";
        document.documentElement.appendChild(canvas);

        drawOverlay();

        canvas.addEventListener("mousedown", (event) => {
          if (event.button !== 0) {
            return;
          }

          isSelecting = true;
          startX = event.clientX;
          startY = event.clientY;
          currentX = event.clientX;
          currentY = event.clientY;
          drawOverlay();
        });

        canvas.addEventListener("mousemove", (event) => {
          if (!isSelecting) {
            return;
          }

          currentX = event.clientX;
          currentY = event.clientY;
          drawOverlay();
        });

        canvas.addEventListener("mouseup", () => {
          if (!isSelecting) {
            return;
          }

          isSelecting = false;
          const rect = normalizeRect(startX, startY, currentX, currentY);
          canvas.remove();

          if (rect.width < 4 || rect.height < 4) {
            addMessage("system", "選取範圍太小，已取消截圖。");
            resolve();
            return;
          }

          cropImage(image, rect);
          resolve();
        });

        canvas.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            canvas.remove();
            resolve();
          }
        });
        canvas.tabIndex = 0;
        canvas.focus();

        function drawOverlay() {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.save();
          context.scale(deviceRatio, deviceRatio);
          context.fillStyle = "rgba(15, 23, 42, 0.36)";
          context.fillRect(0, 0, viewportWidth, viewportHeight);

          if (isSelecting) {
            const rect = normalizeRect(startX, startY, currentX, currentY);
            context.clearRect(rect.x, rect.y, rect.width, rect.height);
            context.strokeStyle = "#60a5fa";
            context.lineWidth = 2;
            context.setLineDash([8, 4]);
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.fillStyle = "rgba(96, 165, 250, 0.12)";
            context.fillRect(rect.x, rect.y, rect.width, rect.height);
          }

          context.restore();
        }
      };

      image.onerror = () => {
        reject(new Error("截圖影像載入失敗。"));
      };

      image.src = fullPageDataUrl;
    });
  }

  function cropImage(image, rect) {
    const scaleX = image.naturalWidth / window.innerWidth;
    const scaleY = image.naturalHeight / window.innerHeight;
    const sourceX = Math.round(rect.x * scaleX);
    const sourceY = Math.round(rect.y * scaleY);
    const sourceWidth = Math.round(rect.width * scaleX);
    const sourceHeight = Math.round(rect.height * scaleY);

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = Math.max(1, sourceWidth);
    outputCanvas.height = Math.max(1, sourceHeight);

    const outputContext = outputCanvas.getContext("2d");
    outputContext.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      outputCanvas.width,
      outputCanvas.height
    );

    croppedImageDataUrl = outputCanvas.toDataURL("image/png");
    previewImage.src = croppedImageDataUrl;
    preview.hidden = false;
    addMessage("system", "截圖完成，請輸入問題後送出。");
  }

  async function sendToGemini() {
    const apiKey = apiKeyInput.value.trim();
    const modelName = normalizeModelName(modelInput.value);
    const userText = promptInput.value.trim();

    if (!apiKey) {
      addMessage("error", "請先設定並儲存 Gemini API Key。");
      return;
    }

    if (!userText && !croppedImageDataUrl) {
      addMessage("error", "請輸入問題，或先截圖再送出。");
      return;
    }

    modelInput.value = modelName;
    await chrome.storage.local.set({
      [STORAGE_KEYS.API_KEY]: apiKey,
      [STORAGE_KEYS.MODEL_NAME]: modelName
    });

    const userMessage = userText || "請分析這張截圖。";
    addMessage("user", userMessage);
    const waitingMessage = addMessage("system", "AI 回覆中...");
    setButtonBusy(sendButton, true, "送出中...");

    try {
      const responseText = await callGeminiApi(apiKey, modelName, userMessage, croppedImageDataUrl);
      waitingMessage.remove();
      addMessage("ai", responseText || "Gemini 沒有回傳文字內容。");
      promptInput.value = "";
    } catch (error) {
      waitingMessage.remove();
      addMessage("error", `Gemini API 錯誤：${error.message}`);
    } finally {
      setButtonBusy(sendButton, false, "送出");
    }
  }

  async function callGeminiApi(apiKey, modelName, userText, imageDataUrl) {
    const parts = [
      { text: `${SYSTEM_PROMPT}\n\nUser request: ${userText}` }
    ];

    if (imageDataUrl) {
      parts.push({
        inline_data: {
          mime_type: "image/png",
          data: stripDataUrlPrefix(imageDataUrl)
        }
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts
            }
          ]
        })
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const apiMessage = data && data.error && data.error.message ? data.error.message : response.statusText;
      throw new Error(buildApiErrorMessage(apiMessage || `HTTP ${response.status}`, modelName));
    }

    return extractGeminiText(data);
  }

  function extractGeminiText(data) {
    const candidates = data && Array.isArray(data.candidates) ? data.candidates : [];
    const parts = candidates[0] && candidates[0].content && Array.isArray(candidates[0].content.parts)
      ? candidates[0].content.parts
      : [];

    return parts
      .map((part) => part.text || "")
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  function addMessage(type, text) {
    const message = document.createElement("div");
    message.className = `ai-helper-message ${type}`;
    message.textContent = text;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight;
    return message;
  }

  function setButtonBusy(button, isBusy, label) {
    button.disabled = isBusy;
    button.textContent = label;
  }

  function normalizeRect(startX, startY, endX, endY) {
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    return { x, y, width, height };
  }

  function stripDataUrlPrefix(dataUrl) {
    return dataUrl.replace(/^data:image\/png;base64,/, "");
  }

  function normalizeModelName(modelName) {
    const trimmed = (modelName || "").trim().replace(/^models\//, "");
    return trimmed || DEFAULT_MODEL_NAME;
  }

  function buildApiErrorMessage(message, modelName) {
    if (/not found|not supported|ListModels/i.test(message)) {
      return `${message}\n\n目前模型：${modelName}\n請確認這個 API Key 可以使用該模型，或改用 ${DEFAULT_MODEL_NAME} / gemini-2.5-flash。`;
    }

    return message;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
})();
