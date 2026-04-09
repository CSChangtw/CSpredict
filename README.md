# 混凝土抗壓強度 AI 預測系統 — AOA-SVR v2.0

PWA 可安裝應用程式，基於 Mu (2024) 高性能混凝土數據集與 Xie et al. (2023) 養護修正係數。

## 部署至 GitHub Pages

1. 上傳此資料夾所有檔案至 GitHub Repository（根目錄）
2. 進入 **Settings → Pages**
3. Source 選擇 **GitHub Actions**
4. Push 後自動觸發部署，網址：`https://<username>.github.io/<repo>/`

## 安裝為 PWA

開啟部署網址後，瀏覽器會提示「新增至主畫面」，點擊即可安裝為獨立 App。

## 檔案結構

```
/
├── index.html                  # 主應用程式
├── manifest.json               # PWA Manifest
├── sw.js                       # Service Worker（離線快取）
├── favicon.ico                 # 瀏覽器分頁圖示
├── apple-touch-icon.png        # iOS 主畫面圖示 (180×180)
├── icon-maskable-512x512.png   # Android Adaptive Icon
├── icon-512x512.png            # 通用大圖示
├── icon-192x192.png            # 通用中圖示
├── icon-{16..384}x{16..384}.png # 各尺寸圖示
└── .github/workflows/deploy.yml # 自動部署 CI/CD
```
