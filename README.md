# 🪙 CoinTrack

**CoinTrack** is a modern, high-performance cryptocurrency dashboard built with **Angular 17+**. It provides real-time market data visualization using **Signals**, **RxJS**, and **Lightweight Charts**.

The application features instant price updates via WebSocket and professional-grade candlestick charts with historical data fetching.

---

## 🚀 Live Demo

Check out the live application deployed on Vercel:
👉 **[View CoinTrack Demo](https://coin-track-indol.vercel.app/)**

---

## ✨ Key Features

* **Real-time Data:** Instant price updates powered by the **Binance WebSocket API**.
* **Interactive Charts:** Professional candlestick charts (OHLC) using the **Lightweight Charts** library (by TradingView).
* **Timeframe Selector:** Support for multiple timeframes (`1m`, `5m`, `15m`, `1h`, `4h`) with historical data backfilling via REST API.
* **Multi-Asset Support:** Seamless switching between popular trading pairs: **BTC/USDT**, **ETH/USDT**, **SOL/USDT**.
* **Reactive Architecture:** Built entirely on **Angular Signals** (`computed`, `effect`) for optimal rendering performance.
* **Visual Indicators:** Real-time price flash animations (Green/Red) and connection status monitoring.
* **Responsive Design:** Fully adaptive layout optimized for both desktop and mobile devices.

---

## 🛠 Tech Stack

* **Framework:** Angular 17+ (Standalone Components).
* **State Management:** Angular Signals & RxJS.
* **Visualization:** Lightweight Charts.
* **Styling:** SCSS (Modular architecture with Variables & Mixins).
* **Data Source:** Binance Public API (WebSocket Stream + REST API).
* **Tooling:** Angular CLI, Vercel (for deployment).

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/CoinTrack.git
cd CoinTrack

```


2. **Install dependencies:**
```bash
npm install

```


3. **Start the development server:**
```bash
ng serve

```


4. Open your browser and navigate to `http://localhost:4200/`.

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── components/
│   │   └── chart/       # Candlestick chart logic (Lightweight Charts)
│   ├── models/          # Interfaces (Ticker, Trade, Candle)
│   ├── services/        # CryptoService (WebSocket & HTTP handling)
│   ├── app.component    # Main layout (Ticker & Coin Selector)
│   └── app.config.ts    # App configuration (HttpClient, Router)
├── environments/        # Environment variables (API URLs)
├── styles/              # Global styles (Variables, Mixins)
└── styles.scss          # Main stylesheet

```
