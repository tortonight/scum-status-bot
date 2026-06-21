# 🎮 SCUM STATUS DISCORD BOT

A Discord bot that displays real-time SCUM game server status using the [BattleMetrics API](https://www.battlemetrics.com/developers). Shows player count, server status, and more — directly in your Discord server.

Discord Bot ที่แสดงสถานะเซิร์ฟเวอร์เกม SCUM แบบ Real-time ผ่าน BattleMetrics API แสดงจำนวนผู้เล่น สถานะเซิร์ฟเวอร์ และอื่นๆ ใน Discord ของคุณ

---

## ✨ Features / ความสามารถ

| Feature | Description |
|---------|-------------|
| `/status` | 🔍 แสดงสถานะเซิร์ฟเวอร์ SCUM แบบละเอียด (Embed สวยงาม) |
| Auto Presence | 🔄 อัปเดตสถานะใต้ชื่อบอทอัตโนมัติ เช่น `🟢 24/64 players on SCUM` |

### `/status` ตัวอย่างข้อมูลที่แสดง

- 🟢 **สถานะ** - Online / Offline
- 👥 **ผู้เล่น** - จำนวนผู้เล่นปัจจุบัน / สูงสุด พร้อม Player Bar กราฟิก
- 🌍 **Map** - แผนที่ปัจจุบัน
- 🎮 **Game Mode** - โหมดเกม
- ⏱ **Uptime** - เวลาที่เซิร์ฟเวอร์เปิดต่อเนื่อง
- 🔗 **IP Address** - ที่อยู่เซิร์ฟเวอร์
- 🆔 **Server ID** - ID จาก BattleMetrics

---

## 🛠 Tech Stack

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript
- **Libraries:** discord.js v14, axios, dotenv

---

## 📋 Requirements / สิ่งที่ต้องเตรียม

| # | What you need | How to get it |
|---|---------------|---------------|
| 1 | **Discord Bot Token** | [Discord Developer Portal](https://discord.com/developers/applications) → New Application → Bot → Reset Token |
| 2 | **SCUM Server ID** | [BattleMetrics](https://www.battlemetrics.com/servers/scum) → เลือกเซิร์ฟเวอร์ → ดู URL (`/scum/1234567`) |
| 3 | **(Optional) BattleMetrics API Key** | [BattleMetrics Developers](https://www.battlemetrics.com/developers) — สำหรับ Rate Limit สูงขึ้น |

---

## 🚀 Installation & Setup / วิธีการติดตั้ง

### 1️⃣ Clone Repository

```bash
git clone https://github.com/tortonight/scum-status-bot.git
cd scum-status-bot
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

```bash
# Windows
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

### 4️⃣ Edit `.env`

```env
# Discord Bot Token (จำเป็น)
DISCORD_TOKEN=your_discord_bot_token_here

# BattleMetrics API Key (ไม่จำเป็น ถ้าไม่ใส่จะใช้ Public API)
BATTLEMETRICS_API_KEY=

# SCUM Server ID ที่ต้องการติดตาม (จำเป็น)
SERVER_ID=1234567

# ความถี่ในการอัปเดตสถานะใต้ชื่อบอท (นาที)
PRESENCE_UPDATE_INTERVAL=5
```

### 5️⃣ Build & Run

```bash
# Build TypeScript
npm run build

# Start bot
npm start
```

หรือรันแบบ Dev Mode (ไม่ต้อง build):

```bash
npm run dev
```

---

## 📁 Project Structure / โครงสร้างโปรเจค

```
scum-status-bot/
├── src/
│   ├── index.ts                 # Entry point
│   ├── bot.ts                   # Discord Client + Command Registration
│   ├── config.ts                # Environment config loader
│   ├── types.ts                 # TypeScript interfaces
│   ├── commands/
│   │   └── status.ts            # /status command
│   └── services/
│       ├── battlemetrics.ts     # BattleMetrics API service
│       └── presenceUpdater.ts   # Auto-update bot presence
├── dist/                        # Compiled JavaScript
├── .env.example                 # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 Commands

### `/status`
แสดงสถานะเซิร์ฟเวอร์ SCUM ปัจจุบัน

**Usage:**
```
/status
```

**Response:**
- 📊 Discord Embed พร้อมข้อมูลทั้งหมด
- 🟩 Player Bar กราฟิกแสดงสัดส่วนผู้เล่น

---

## 🔧 Configuration / การตั้งค่า

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DISCORD_TOKEN` | ✅ Yes | - | Discord Bot Token |
| `SERVER_ID` | ✅ Yes | - | SCUM Server ID จาก BattleMetrics |
| `BATTLEMETRICS_API_KEY` | ❌ No | - | API Key (optional, for higher rate limits) |
| `PRESENCE_UPDATE_INTERVAL` | ❌ No | `5` | Presence update interval (minutes) |

---

## 💡 How It Works / วิธีการทำงาน

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐
│ Discord  │◄───►│ SCUM STATUS │◄───►│ BattleMetrics│
│ Server   │     │    BOT      │     │     API      │
│          │     │             │     │              │
│ /status  │     │ discord.js  │     │ GET /servers │
│ Presence │     │ axios       │     │   /{id}      │
└──────────┘     └─────────────┘     └──────────────┘
```

1. Bot เรียก BattleMetrics API `GET /servers/{id}` ทุกๆ `N` นาที
2. อัปเดต Discord Presence (สถานะใต้ชื่อบอท)
3. เมื่อผู้ใช้พิมพ์ `/status` บอทดึงข้อมูล实时จาก API แล้วแสดง Embed

---

## 🤝 Contributing / การร่วมพัฒนา

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License — feel free to use this project for your own Discord server.

---

## ⚠️ Disclaimer

This project is not affiliated with or endorsed by BattleMetrics or SCUM (Gamepires). All data is retrieved via BattleMetrics' public API.