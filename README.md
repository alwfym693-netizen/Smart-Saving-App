# 🌱 ازدهار — Izdihar Savings App

> **اِزرع ثروتك** — كل ريال بذرة تنمو

A premium Arabic-first gamified savings app with a cartoon apple tree, AI investment companion, seasonal harvest investing, daily missions, and full RTL support.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌳 **Growing Apple Tree** | 10-level SVG cartoon tree that grows as you save — from seed to legendary |
| 🍎 **Apple Rewards** | Tap ripe apples to win real coupon codes (AlBaik, Careem, H&M, Starbucks…) |
| 🌾 **Seasonal Harvest** | Invest in real stocks (أرامكو، الراجحي، آبل، إنفيديا…) with interactive charts & AI analysis |
| 🤖 **ازدهار AI** | Claude-powered Arabic financial companion — answers any question about savings, investing, your tree |
| ⚡ **Daily Missions** | 5 missions per day with XP and apple rewards, auto-refreshing countdown |
| 🎨 **Tree Customization** | 6 seasonal leaf themes + 10 decor items unlocked by savings milestones |
| 💡 **Demo Mode** | Practice investing with 50,000 SAR virtual balance — no real money at risk |
| 📊 **P&L Dashboard** | Live profit/loss charts with animated indicators for every investment |
| 🇸🇦 **Full Arabic RTL** | Tajawal + Cairo fonts, right-to-left, Saudi Riyal currency |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- An **Anthropic API key** ([get one free](https://console.anthropic.com/))

### 1 — Clone / Extract

```bash
# If you downloaded the ZIP:
unzip izdihar-app.zip
cd izdihar-app

# If you cloned the repo:
git clone <repo-url>
cd izdihar-app
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

### 4 — Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app opens automatically.

---

## 📁 Project Structure

```
izdihar-app/
├── public/
│   └── favicon.svg          # App icon (green seed emoji)
├── src/
│   ├── main.jsx             # React entry point
│   └── App.jsx              # Complete app (single-file architecture)
├── index.html               # HTML shell
├── vite.config.js           # Vite bundler config
├── package.json             # Dependencies & scripts
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── eslint.config.js         # Linting rules
└── README.md                # This file
```

> **Single-file architecture:** The entire app lives in `src/App.jsx`. This makes it easy to open in Claude.ai Artifacts, share as a single file, or copy-paste into any React playground like StackBlitz or CodeSandbox.

---

## 🔧 Available Scripts

```bash
npm run dev        # Start dev server on localhost:3000
npm run build      # Production build → ./dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint checks
```

---

## 🌐 Deploying to Production

### Vercel (recommended — 1 click)

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add `VITE_ANTHROPIC_API_KEY` in Vercel environment variables
4. Deploy ✅

### Netlify

```bash
npm run build
# Drag the ./dist folder to netlify.com/drop
```

Add `VITE_ANTHROPIC_API_KEY` in Netlify → Site settings → Environment variables.

### Manual (any static host)

```bash
npm run build
# Upload ./dist to your web server
```

---

## ⚠️ Security — Production API Key Handling

**For local development**, the API key in `.env` is fine.

**For production**, you should **never expose** your Anthropic key in frontend code. Instead:

1. Create a simple backend proxy (Node.js / Python / Cloudflare Worker)
2. The proxy adds the API key on the server side
3. Your frontend calls your proxy instead of Anthropic directly

Example Cloudflare Worker proxy:

```js
export default {
  async fetch(request) {
    const body = await request.json();
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,       // Secret stored server-side
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
    return new Response(await res.text(), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
```

---

## 🛠 Customization Guide

### Change the app name / branding

In `src/App.jsx`, find the `A` object near the top:

```js
const A = {
  app:"ازدهار",        // ← App name
  tag:"اِزرع ثروتك",  // ← Tagline
  tagSub:"كل ريال بذرة تنمو",  // ← Sub-tagline
  ...
}
```

### Change the color palette

Find the `P` object near the top of `App.jsx`:

```js
const P = {
  forest:"#1B4332",    // ← Primary dark green
  forestM:"#2D6A4F",   // ← Medium green
  forestL:"#40916C",   // ← Light green
  gold:"#E8A44A",      // ← Accent gold
  ...
}
```

### Add or edit stocks

Find the `STOCKS` array and add entries following this structure:

```js
{
  id:"mystock",
  name:"اسم الشركة",
  nameEn:"Company Name",
  e:"💰",              // Emoji icon
  c:"#FF5722",         // Brand color (hex)
  ticker:"TICK",       // Stock ticker
  exchange:"تداول",   // Exchange name
  sector:"القطاع",
  risk:"low",          // "low" | "med" | "high"
  months:3,            // Investment period in months
  ret:12,              // Expected annual return %
  desc:"وصف قصير",
  price:100.00,        // Current price
  change:+1.5,         // Daily change %
  cap:"١٠٠ مليار",    // Market cap
  dividend:"3٪",      // Dividend yield (or "لا يوجد")
  high52:"120",        // 52-week high
  low52:"80",          // 52-week low
  about:"وصف مطول عن الشركة...",
  whyInvest:"لماذا يستثمر الناس...",
  risks:"المخاطر المحتملة...",
  stability:"وصف الاستقرار التاريخي",
  category:"الفئة",
  historicalReturns:{
    d:+1.5,   // 1 day %
    w:+3.2,   // 1 week %
    m:+5.8,   // 1 month %
    m3:+11.2, // 3 months %
    m6:+18.4, // 6 months %
    y:+24.6,  // 1 year %
    y5:+62.3, // 5 years %
    all:+140, // All time %
  },
}
```

### Change tree level thresholds

Find the `LEVELS` array:

```js
const LEVELS = [
  {lv:1, name:"البذرة",  min:0,    apples:0, ...},
  {lv:2, name:"البادرة", min:100,  apples:0, ...},
  // ← Change the `min` values to adjust when each level unlocks
]
```

### Change leaf themes & unlock prices

Find the `THEMES` array and adjust `minS` (minimum savings to unlock):

```js
const THEMES = [
  {id:"spring", name:"ربيعي 🌸", minS:0,    ...},  // Free
  {id:"summer", name:"صيفي ☀️",  minS:500,  ...},  // Unlock at 500 SAR
  ...
]
```

---

## 🎮 How to Play / User Guide

### Getting Started
1. Open the app and tap **ابدأ النمو** (Start Growing)
2. Deposit any amount → your seed grows into a tree
3. Every **100 SAR** saved = one apple appears on your tree
4. Tap a ripe apple 🍎 → it falls, opens, and reveals a reward coupon

### Tree Levels
| Level | Name | Required |
|-------|------|----------|
| 1 | البذرة (Seed) | 0 SAR |
| 2 | البادرة (Sprout) | 100 SAR |
| 3 | الشتلة (Seedling) | 250 SAR |
| 4 | الشجيرة (Shrub) | 600 SAR |
| 5 | الشجرة الصغيرة | 1,200 SAR |
| 6 | الشجرة الناضجة | 2,500 SAR |
| 7 | الشجرة المزهرة | 4,500 SAR |
| 8 | الشجرة العظيمة | 7,000 SAR |
| 9 | شجرة الحكمة | 10,000 SAR |
| 10 | الأسطورية 👑 | 15,000 SAR |

### Seasonal Harvest (Investing)
1. Go to **الحصاد** tab
2. Tap **ازرع استثماراً جديداً**
3. Choose a stock (أرامكو، آبل، إنفيديا، etc.)
4. Read the AI analysis → view the interactive chart
5. Toggle **وضع التدريب** to practice with virtual money
6. Enter amount (minimum 500 SAR) → tap invest
7. Simulate growth or wait for the season to end
8. **Harvest** when ready 🌾

### Daily Missions
- 5 new missions appear every day at midnight
- Complete them to earn XP points and apple rewards
- Missions include: deposit, visit your tree, ask AI, invest, customize

### Tree Customization
- Go to **شجرتي** → **تخصيص** tab
- Change leaf themes (6 themes, unlocked by savings milestones)
- Place decorations around your tree (rocks, lanterns, flowers, moon…)

---

## 🤖 AI Assistant (ازدهار AI)

The app uses **Claude Sonnet** from Anthropic. The AI knows:
- Your exact balance and tree level
- Your active investments and their P&L
- Days needed to reach the next tree level
- Your daily missions progress

Ask it anything in Arabic:
- "كيف أرفع مستوى شجرتي؟"
- "اشرح لي الحصاد الموسمي"
- "هل يجب أن أسحب أموالي؟"
- "نصائح للادخار الشهري"

---

## 📱 Mobile Installation (PWA)

Although not yet fully configured as a PWA, you can install it on mobile:

**iOS Safari:** Share → Add to Home Screen  
**Android Chrome:** Menu → Add to Home Screen

---

## 🐛 Troubleshooting

**AI not responding?**
- Check that `VITE_ANTHROPIC_API_KEY` is set in your `.env`
- Verify the key is valid at [console.anthropic.com](https://console.anthropic.com)

**App not loading?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Build errors?**
- Make sure you're on Node.js 18+: `node --version`
- Try: `npm run build 2>&1 | head -50`

**Port already in use?**
```bash
# Change port in vite.config.js, or:
npm run dev -- --port 4000
```

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Built With

- **React 18** — UI framework
- **Vite 5** — Build tool & dev server  
- **Claude AI (Anthropic)** — AI assistant & investment analysis
- **SVG** — Hand-crafted cartoon apple tree
- **Google Fonts** — Tajawal & Cairo Arabic typefaces

---

*Made with 💚 — ازدهار means "prosperity" in Arabic*
