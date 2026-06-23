# 🎮 SCUM STATUS DISCORD BOT

A Discord bot that displays real-time SCUM game server status using the [BattleMetrics API](https://www.battlemetrics.com/developers). Shows player count, server status, and more — directly in your Discord server.

Discord Bot ที่แสดงสถานะเซิร์ฟเวอร์เกม SCUM แบบ Real-time ผ่าน BattleMetrics API แสดงจำนวนผู้เล่น สถานะเซิร์ฟเวอร์ และอื่นๆ ใน Discord ของคุณ

---

## ✨ Features / ความสามารถ

| Feature | Description |
|---------|-------------|
| `/setup` | 🏗️ สร้าง Category `🛢️ SCUM Server` + Channel `📊┃server-status` อัตโนมัติ (ครั้งเดียว) |
| `/status` | 📝 ส่ง/อัปเดต Embed สถานะเซิร์ฟเวอร์ไปยัง `📊┃server-status` (แก้ไขข้อความเก่า ไม่รก) |
| `/cleanup` | 🧹 ลบ Category, Channel และข้อมูล setup ทั้งหมด |
| Auto Presence | 🔄 อัปเดตสถานะใต้ชื่อบอทอัตโนมัติ เช่น `🟢 24/64 players on SCUM` |
| Auto Channel | ♻️ อัปเดต Embed ใน channel อัตโนมัติทุก X นาที (แก้ไขข้อความเดิม ไม่สร้างใหม่) |

### `/status` ตัวอย่างข้อมูลที่แสดงใน Embed

- 🟢 **สถานะ** — Online / Offline
- 👥 **ผู้เล่น** — จำนวนผู้เล่นปัจจุบัน / สูงสุด พร้อม Player Bar กราฟิก 🟩⬜
- 🌍 **Map** — แผนที่ปัจจุบัน
- 🎮 **Game Mode** — โหมดเกม
- ⏱ **Uptime** — เวลาที่เซิร์ฟเวอร์เปิดต่อเนื่อง
- 🔗 **IP Address** — ที่อยู่เซิร์ฟเวอร์
- 🆔 **Server ID** — ID จาก BattleMetrics

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
| 3 | **Manage Channels Permission** | Bot ต้องการสิทธิ์ `Manage Channels` เพื่อสร้าง/ลบ Category/Channel (ใช้ `/setup` / `/cleanup`) |
| 4 | **(Optional) BattleMetrics API Key** | [BattleMetrics Developers](https://www.battlemetrics.com/developers) — สำหรับ Rate Limit สูงขึ้น |

---

## 🚀 Installation & Setup / วิธีการติดตั้ง

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/scum-status-bot.git
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

# ความถี่ในการอัปเดตสถานะ (นาที)
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

### 6️⃣ ตั้งค่าใน Discord (ครั้งแรกเท่านั้น)

พิมพ์ `/setup` ใน Discord server ที่ต้องการ:
- ✅ Bot จะสร้าง Category `🛢️ SCUM Server` และ Channel `📊┃server-status` อัตโนมัติ
- ✅ Channel จะถูกตั้งค่าเป็น **Read-Only** (ทุกคนดูได้ แต่โพสต์ไม่ได้)
- ✅ ข้อมูลถูกบันทึกลง `data/setup.json` โดยอัตโนมัติ

หลังจากนั้นพิมพ์ `/status` เพื่ออัปเดต Embed แรก หรือรอ Auto-Update ประมาณ 5 นาที

---

## 📁 Project Structure / โครงสร้างโปรเจค

```
scum-status-bot/
├── src/
│   ├── index.ts                    # Entry point
│   ├── bot.ts                      # Discord Client + Command Registration
│   ├── config.ts                   # Environment config loader
│   ├── types.ts                    # TypeScript interfaces
│   ├── commands/
│   │   ├── status.ts               # /status command
│   │   ├── setup.ts                # /setup command (สร้าง Category/Channel)
│   │   └── cleanup.ts              # /cleanup command (ลบ Category/Channel)
│   └── services/
│       ├── battlemetrics.ts        # BattleMetrics API service
│       ├── presenceUpdater.ts      # Auto-update bot presence + channel
│       ├── statusEmbed.ts          # สร้าง Embed + จัดการ edit ข้อความ
│       └── dataStore.ts            # เก็บข้อมูล setup แบบ JSON
├── data/
│   └── setup.json                  # ข้อมูลเซ็ตอัพ (สร้างอัตโนมัติ)
├── dist/                           # Compiled JavaScript
├── .env.example                    # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 Commands

### `/setup`
สร้าง Category และ Channel สำหรับแสดงสถานะ SCUM Server

| รายละเอียด | ค่า |
|------------|-----|
| **Category** | `🛢️ SCUM Server` |
| **Channel** | `📊┃server-status` (Read-Only) |
| **Permission** | เฉพาะ Administrator |
| **แนะนำให้ใช้** | ครั้งแรกที่ติดตั้งเท่านั้น |

**Usage:**
```
/setup
```

**Response:**
- ✅ ยืนยันการสร้าง Category และ Channel
- 🆔 แสดง ID ของ Category และ Channel

---

### `/status`
อัปเดตสถานะเซิร์ฟเวอร์ SCUM ไปยัง Channel ที่ตั้งค่าไว้

| รายละเอียด | ค่า |
|------------|-----|
| **พฤติกรรม** | ส่ง Embed ไปที่ `📊┃server-status` |
| **การจัดการข้อความ** | แก้ไข (edit) ข้อความเก่า — ไม่รก channel |
| **การตอบกลับผู้ใช้** | Ephemeral (เฉพาะผู้ใช้คำสั่งมองเห็น) |

**Usage:**
```
/status
```

**Response (ใน channel):**
- 📊 Discord Embed พร้อมข้อมูลทั้งหมด
- 🟩 Player Bar กราฟิกแสดงสัดส่วนผู้เล่น

**Response (ถึงผู้ใช้):**
- ✅ ยืนยันว่าอัปเดตสำเร็จ พร้อมข้อมูลสรุป

---

### `/cleanup`
ลบ Category `🛢️ SCUM Server`, Channel `📊┃server-status` และข้อมูล setup

| รายละเอียด | ค่า |
|------------|-----|
| **สิ่งที่ถูกลบ** | 🗑️ Channel `📊┃server-status`, 📁 Category `🛢️ SCUM Server`, 📄 ข้อมูลใน `data/setup.json` |
| **Permission** | เฉพาะ Administrator |
| **แนะนำให้ใช้** | เมื่อต้องการลบและตั้งค่าใหม่ หรือเลิกใช้บอท |

**Usage:**
```
/cleanup
```

**Response:**
- 🧹 รายการสิ่งที่ถูกลบ
- ✅ ข้อมูล setup.json ถูกลบ
- 📝 สามารถใช้ `/setup` เพื่อตั้งค่าใหม่อีกครั้ง

---

### Auto Update (อัตโนมัติ)

บอทจะทำงาน 2 อย่างพร้อมกันทุกๆ `PRESENCE_UPDATE_INTERVAL` นาที:

| ฟังก์ชัน | รายละเอียด |
|----------|-----------|
| 👤 **สถานะใต้ชื่อบอท** | `🟢 24/64 players on SCUM` หรือ `🔴 SCUM Server Offline` |
| 📝 **Embed ใน channel** | แก้ไข (edit) ข้อความใน `📊┃server-status` — ผู้ใช้เห็น实时 |

---

## 🔧 Configuration / การตั้งค่า

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DISCORD_TOKEN` | ✅ Yes | — | Discord Bot Token |
| `SERVER_ID` | ✅ Yes | — | SCUM Server ID จาก BattleMetrics |
| `BATTLEMETRICS_API_KEY` | ❌ No | — | API Key (optional, for higher rate limits) |
| `PRESENCE_UPDATE_INTERVAL` | ❌ No | `5` | Auto-update interval (minutes) |

> หมายเหตุ: `STATUS_CHANNEL_ID` ไม่จำเป็นต้องตั้งใน `.env` แล้ว เพราะ `/setup` จะบันทึกลงใน `data/setup.json` อัตโนมัติ

---

## 💡 How It Works / วิธีการทำงาน

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Discord    │◄────│  SCUM STATUS     │◄────│ BattleMetrics│
│   Server     │     │      BOT         │     │     API      │
│              │     │                  │     │              │
│ /setup       │     │ discord.js       │     │ GET /servers │
│   → สร้าง    │     │ axios            │     │   /{id}      │
│   Category   │     │ data/setup.json  │     │              │
│   + Channel  │     │                  │     │              │
│              │     │ Auto-update      │     │              │
│ /status      │     │   ├─ Presence    │     │              │
│   → ส่ง Embed│     │   └─ Edit Embed  │     │              │
│   ไป Channel │     │      ใน Channel  │     │              │
│              │     │                  │     │              │
│ /cleanup     │     │ Delete Channel   │     │              │
│   → ลบ      │     │ + Category       │     │              │
│   ทุกอย่าง   │     │ + setup.json     │     │              │
└──────────────┘     └──────────────────┘     └──────────────┘
```

1. **ครั้งแรก:** ผู้ใช้พิมพ์ `/setup` → Bot สร้าง `🛢️ SCUM Server` / `📊┃server-status` อัตโนมัติ
2. **Auto Update:** Bot เรียก BattleMetrics API ทุกๆ `N` นาที → อัปเดต Presence + **แก้ไข (edit) Embed** ใน channel
3. **Manual:** ผู้ใช้พิมพ์ `/status` → Bot ดึงข้อมูล实时 → อัปเดต Embed ใน channel (edit ข้อความเก่า)
4. **Cleanup:** ผู้ใช้พิมพ์ `/cleanup` → Bot ลบ Channel, Category และข้อมูล setup ทั้งหมด
5. **การตอบกลับ:** ผู้ใช้เห็นเฉพาะ ephemeral message ยืนยันการทำงาน — Embed หลักอยู่ที่ channel

---

## 🤝 Contributing / การร่วมพัฒนา

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License — feel free to use this project for your own Discord server.

---

## ⚠️ Disclaimer

This project is not affiliated with or endorsed by BattleMetrics or SCUM (Gamepires). All data is retrieved via BattleMetrics' public API.