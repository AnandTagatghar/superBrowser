window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("dark-purple-theme");

  const webviewContainer = document.querySelector(".content");
  const backBtn = document.getElementById("back-btn");
  const forwardBtn = document.getElementById("forward-btn");
  const reloadBtn = document.getElementById("reload-btn");
  const newWindowBtn = document.getElementById("new-window-btn");
  const goBtn = document.getElementById("go-btn");
  const urlInput = document.getElementById("url-input");
  const themeBtn = document.getElementById("theme-btn");
  const tabsContainer = document.getElementById("tabs-container");
  const minimizeBtn = document.getElementById("minimize-btn");
  const maximizeBtn = document.getElementById("maximize-btn");
  const closeBtn = document.getElementById("close-btn");

  let currentWebview = document.getElementById("webview");

  function createTab(webview, title = "Loading...") {
    const newTab = document.createElement("div");
    newTab.classList.add("tab-container");

    const tabButton = document.createElement("button");
    tabButton.textContent =
      title.length > 15 ? title.substring(0, 15) + "..." : title;
    tabButton.classList.add("tab");
    newTab.appendChild(tabButton);

    const closeButton = document.createElement("span");
    closeButton.textContent = "x";
    closeButton.classList.add("close-btn");
    newTab.appendChild(closeButton);

    tabsContainer.appendChild(newTab);

    tabButton.addEventListener("click", () => {
      document
        .querySelectorAll("webview")
        .forEach((wv) => wv.classList.add("hidden"));
      document
        .querySelectorAll(".tab")
        .forEach((tab) => tab.classList.remove("active-tab"));
      webview.classList.remove("hidden");
      tabButton.classList.add("active-tab");
      webview.addEventListener("dom-ready", () => {
        currentWebview = webview;
        if (webview.getURL() === "about:blank") {
          urlInput.value = "";
        } else {
          urlInput.value = webview.getURL();
        }
      });
    });

    closeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      webview.remove();
      newTab.remove();
      if (currentWebview === webview) {
        const remainingTabs = document.querySelectorAll(".tab-container");
        if (remainingTabs.length > 0) {
          remainingTabs[0].querySelector(".tab").click();
        } else {
          newWindowBtn.click();
        }
      }
    });

    return tabButton;
  }

  backBtn.addEventListener("click", () => {
    currentWebview.goBack();
  });

  forwardBtn.addEventListener("click", () => {
    currentWebview.goForward();
  });

  reloadBtn.addEventListener("click", () => {
    currentWebview.reload();
  });

  newWindowBtn.addEventListener("click", () => {
    const newWebview = document.createElement("webview");
    newWebview.src = "https://www.google.co.in";
    newWebview.preload = "../scripts/preload.js";
    newWebview.style.width = "100%";
    newWebview.style.height = "100%";
    newWebview.style.border = "none";
    newWebview.classList.add("hidden");
    webviewContainer.appendChild(newWebview);

    const newTab = createTab(newWebview);

    newWebview.addEventListener("page-title-updated", (event) => {
      newTab.textContent =
        event.title.length > 15
          ? event.title.substring(0, 15) + "..."
          : event.title;
    });

    newWebview.addEventListener("did-stop-loading", () => {
      urlInput.value = newWebview.getURL();
    });

    newTab.click();
  });

  goBtn.addEventListener("click", () => {
    currentWebview.loadURL(urlInput.value);
  });

  urlInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      currentWebview.loadURL(urlInput.value);
    }
  });

  themeBtn.addEventListener("click", () => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("dark-purple-theme");
    } else {
      document.body.classList.remove("dark-purple-theme");
      document.body.classList.add("dark-theme");
    }
  });

  minimizeBtn.addEventListener("click", () => {
    window.electronAPI.minimizeWindow();
  });

  maximizeBtn.addEventListener("click", () => {
    window.electronAPI.maximizeWindow();
  });

  closeBtn.addEventListener("click", () => {
    window.electronAPI.closeWindow();
  });

  currentWebview.addEventListener("did-stop-loading", () => {
    urlInput.value = currentWebview.getURL();
  });

  currentWebview.addEventListener("page-title-updated", (event) => {
    const currentTab = tabsContainer.querySelector(
      ".tab-container .tab.active-tab"
    );
    if (currentTab) {
      currentTab.textContent =
        event.title.length > 15
          ? event.title.substring(0, 15) + "..."
          : event.title;
    }
  });

  createTab(currentWebview, "Google").classList.add("active-tab");

  window.electronAPI.createNewTab(() => {
    newWindowBtn.click();
  });

  window.electronAPI.openDevTools(() => {
    let webview = Array.from(webviewContainer.childNodes).filter(
      (wv) => wv.classList == ""
    )[0];

    webview.openDevTools();
  });
});
