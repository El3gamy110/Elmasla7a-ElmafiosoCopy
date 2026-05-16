# 🕵️‍♂️ El Maslaha | Investigation Game
> *A multiplayer social deduction and investigation strategy game built with a vibrant Neon/Funky theme. Features a deep dark high-contrast background tailored for immersive criminal investigation gameplay.*

---

## 🌌 About The Game

**"El Maslaha"** (The Interest / The Deal) is a web-based social deduction game built around hidden roles. Players are dropped into complex, high-stakes criminal scenarios where they are split into two factions: **Innocents** trying to uncover the truth, and the **Mafia** attempting to evade justice and frame others.

What sets this game apart is its immersive narrative depth. Each scenario features detailed forensic evidence, medical examiner reports, chemical traces, and specific job-based motives (e.g., Doctor, Engineer, Chemist) that make every single round feel like a dynamic, interactive true-crime film.

---

## ✨ Key Features

* 🧠 **100+ Detailed Criminal Scenarios:** A massive database (`data.js`) of unique, long-form criminal cases to ensure high replayability.
* 🔎 **Numbered Forensic Evidence:** Precise, numbered crime scene findings (Evidence 1, Evidence 2...) including fingerprints, biometric overrides, and toxicology reports.
* 🎭 **Dynamic Role & Motive System:** Every player receives a specific profession within the case, complete with custom lore and personalized motives if they are assigned the Mafia role.
* ⚡ **"Gawlat al-Hasm" (The Decisive Round):** An endgame trigger that activates automatically when only 1 Innocent and 1 Mafia player remain, generating final, high-stakes clues to settle the match.
* 🎨 **Neon Funky UI:** A slick, glowing dark-mode aesthetic with custom neon flickering animations designed to guarantee maximum visibility for high-contrast white text.

---

## 🛠️ Tech Stack

* **HTML5:** For core structural layouts, state screens, and modular game loops.
* **CSS3 (Custom Properties & Keyframes):** Powers the neon glow effects, typographic shadows, responsive Flex/Grid layouts, and smooth animations.
* **JavaScript (ES6+ Vanilla JS):** Drives the core game engine, handling state management, randomized role distribution, scenario filtering, and round transitions natively—zero external dependencies required.

---

## 📁 Project Structure

```text
├── index.html        # Main application entry point and Splash Screen
├── style.css         # Neon stylesheets, global font injection, and glow keyframes
├── app.js            # Core Game Engine managing rounds, voting, and game states
└── data.js           # SCENARIOS_DATABASE holding the 100+ crime cases
```

---

## 🎮 Gameplay Loop

1. Setup: Enter the player names and launch the game from the Splash Screen.

2. Secret Role Assignment: The engine dynamically picks a scenario from the database and distributes professions. Exactly one player is secretly assigned as the "Mafia" along with their execution plot.

3. Investigation: Numbered forensic files and the initial case background are displayed on screen. Players cross-examine each other's motives based on their assigned jobs.

4. Voting: The group votes to eliminate the top suspect.

5. The Decisive Round: If the Mafia successfully eliminates the group down to a 1v1 showdown, the engine triggers the "Decisive Round," revealing final, critical evidence to give the surviving innocent one last shot at exposing the killer.

---

## 🚀 Installation & Local Setup

Since the project uses pure Vanilla web technologies, it runs out of the box without needing any package managers or local servers:
1. Clone the repository:
Bash: git clone https://github.com/El3gamy110/Elmasla7a-ElmafiosoCopy.git
2. Navigate into the project folder:
Bash: cd Elmasla7a-ElmafiosoCopy
3. Launch the game:
Simply double-click index.html to open it instantly in any modern web browser (Chrome, Edge, Firefox, Safari). The game functions perfectly 100% offline.

---

## 📝 Developer Notes

* To expand the game or write custom crime files, open data.js and push a new object into the SCENARIOS_DATABASE array matching the established structural schema (id, place, victim, motive, evidences, jobs).
* The Cairo Arabic font is globally applied across all DOM elements using !important flags in the CSS layer to ensure uniform text rendering and prevent default fallback layout shifts.

---

## 💡 Developed with passion to bring a premier, narrative-driven social deduction experience to the web.
