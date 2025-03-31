# ⚡ Rainsweeper

> A custom-built Minesweeper game written in vanilla JavaScript and rendered on HTML5 Canvas — featuring two game modes, zoom/drag support, undo, and logic-based generation.

---

## ⚠️ Epilepsy Warning

This game includes bright lightning flashes and thunder sound effects.  
If you're sensitive to flashing lights or loud noises, we strongly recommend avoiding this application.  
**Stay safe and healthy! ❤️**

---

## 🎮 Gameplay Overview

Rainsweeper is a logic-based minesweeper game with extended mechanics and two unique modes:

- **Left-click** to open a cell  
- **Right-click** (or long-tap on mobile) to flag a mine  
- **Click on numbered cells** to auto-open neighbors if the correct number of flags is placed  
- **Undo** your last move (via button or `Ctrl + Z`)  
- **Reveal**, **restart**, or **generate a new field** anytime  
- **Zoom in/out** with mouse wheel (desktop) or pinch gesture (mobile)  
- **Drag the field** using `Ctrl + Left Click` (desktop) or two fingers (mobile)

---

## 🧠 Game Modes

Use the **"NP"** button to toggle between two field generation modes:

### 1. Standard Mode (default)
Generates a random field at the start of the game. Some situations may require guessing (50/50), as in traditional Minesweeper.

### 2. NP Mode – *Logically Solvable Only*
The field is generated **after your first click**, and only if it can be solved entirely through logic (no guessing).  
This approach is based on academic research showing that Minesweeper solvability is **NP-complete**.  
The implementation brute-forces board generation until it finds a solvable one.

> ⚠️ Currently in development: may take long to generate solvable fields on Medium/Hard difficulty.

---

## 🛠️ Technical Highlights

- Built with **vanilla JavaScript**, no frameworks  
- Rendered with **HTML5 Canvas**  
- Modular architecture and state management  
- Custom implementation of game logic and mechanics  
- Inspired by theoretical computer science: **P ≠ NP**

---

## ✅ TODO / Improvements

- Improve NP-mode generation speed on larger grids  
- Add animations and visual polish  
- Add sound toggle and accessibility settings

---

## 🧪 Try it live:

👉 [**Play Rainsweeper**](https://anewww.github.io/Rainsweeper/)

---

## 🧠 Author Note

This project was born out of deep interest in algorithmic complexity and interactive UI.  
The NP-mode was inspired by research on decision problem modeling and the theoretical limits of solvable logic puzzles.  
Built with passion, focus, and curiosity.

Enjoy playing! ⚡
