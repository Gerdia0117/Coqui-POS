# 🐸 Coqui POS - Launcher Documentation

## How to Start Coqui POS Like a Desktop App

When you click on "Coqui POS" from your applications menu, it automatically:
1. Opens a terminal
2. Starts the Flask backend server
3. Starts the Vite frontend server
4. Opens your web browser to http://localhost:5173

---

## 📁 Launcher File Locations

### 1. Desktop Application Entry
**Location:** `~/.local/share/applications/coqui-pos.desktop`
**Full Path:** `/home/holberton/.local/share/applications/coqui-pos.desktop`

This creates the clickable icon in your application menu.

```ini
[Desktop Entry]
Name=Coqui POS
Exec=/home/holberton/start-coqui-pos.sh
Type=Application
Terminal=true
Icon=/home/holberton/Coqui-POS/coqui-icon.png
Categories=Development;
```

---

### 2. Start Script (Main Launcher)
**Location:** `/home/holberton/start-coqui-pos.sh`

This bash script starts both servers and opens the browser.

**What it does:**
- Activates Python virtual environment
- Starts Flask backend on port 5000 (background)
- Starts Vite frontend on port 5173 (background)
- Waits 3 seconds for initialization
- Automatically opens browser
- Keeps terminal open to show server logs
- Press Ctrl+C to stop both servers

---

### 3. Stop Script (Emergency Stop)
**Location:** `/home/holberton/stop-coqui-pos.sh`

Use this if servers don't stop properly or you need to force-quit.

```bash
bash ~/stop-coqui-pos.sh
```

---

## 🚀 How to Use

### Option 1: Click Icon (Recommended)
1. Open your applications menu
2. Search for "Coqui POS"
3. Click the icon
4. Wait for terminal and browser to open
5. Done! Your POS is running

### Option 2: Run Script Manually
```bash
bash ~/start-coqui-pos.sh
```

### Option 3: Run Servers Separately (For Development)
**Terminal 1 - Backend:**
```bash
cd /home/holberton/Coqui-POS/backend
source venv/bin/activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd /home/holberton/Coqui-POS/frontend
npm run dev
```

**Browser:**
Navigate to `http://localhost:5173`

---

## 🛑 How to Stop

### Option 1: Terminal
Press `Ctrl+C` in the terminal window

### Option 2: Force Stop
```bash
bash ~/stop-coqui-pos.sh
```

### Option 3: Kill Processes Manually
```bash
pkill -f "python3 app.py"
pkill -f "npm run dev"
```

---

## 📍 Project Structure

```
/home/holberton/
├── Coqui-POS/                          ← Main project folder
│   ├── backend/                        ← Flask backend
│   │   ├── app.py                      ← Backend server (port 5000)
│   │   ├── venv/                       ← Python virtual environment
│   │   └── database/                   ← JSON data files
│   ├── frontend/                       ← React frontend
│   │   ├── src/                        ← React components
│   │   │   ├── components/             ← All UI components
│   │   │   ├── data/menuData.js        ← Menu items
│   │   │   └── styles/main.css         ← Styling
│   │   └── package.json                ← Frontend dependencies
│   └── coqui-icon.png                  ← App icon
├── start-coqui-pos.sh                  ← Launcher script
└── stop-coqui-pos.sh                   ← Stop script

/home/holberton/.local/share/applications/
└── coqui-pos.desktop                   ← Desktop entry file
```

---

## 🔧 Technical Details

### Backend
- **Framework:** Flask (Python)
- **Port:** 5000
- **CORS Enabled:** Yes (line 17 in app.py)
- **Data Storage:** JSON files in `/backend/database/`

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Port:** 5173 (default Vite port)
- **Styling:** Vanilla CSS (2400+ lines)

### Connection
- Frontend makes `fetch()` calls to `http://localhost:5000`
- Backend allows these requests via CORS
- Both run on same machine (localhost)

---

## 🎓 For Your Teacher

If your teacher asks **"How does this work like a desktop app?"**, show them:

1. **The desktop file:** `~/.local/share/applications/coqui-pos.desktop`
2. **The start script:** `/home/holberton/start-coqui-pos.sh`
3. Explain: *"When I click the icon, it runs a bash script that starts both servers in the background and opens the browser. It's not a compiled desktop app like .exe, but it launches like one with a single click."*

---

## 📝 Notes

- This is a **web application** that runs locally
- Not a standalone desktop app (no Electron/Tauri wrapper)
- Requires both backend and frontend running simultaneously
- Browser is used as the UI
- All data stored locally in JSON files
- No internet connection required

---

**Created:** February 26, 2026
**Project:** Coqui POS - Puerto Rican Restaurant Point of Sale System
**Developer:** Your Name
**School:** Holberton School
