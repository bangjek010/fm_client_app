# FM Player Role Scoring Tool - Modern Edition

 <!-- Ganti dengan URL screenshot aplikasi Anda -->

A powerful, 100% offline, browser-based tool to analyze your Football Manager squad. This tool helps you determine the best roles for your players based on their attributes and customizable role weightings. Built with a modern, responsive interface using Bootstrap and vanilla JavaScript.

This project is an enhanced and modernized version inspired by the original work of **Fatheed7** and **HarrisonRClark**.

---

## ✨ Key Features

This tool is packed with advanced features designed for serious Football Manager players:

*   **⚡ Modern & Fast Interface:** A clean, glassmorphism-inspired UI that is fully responsive and works beautifully on desktop and mobile.
*   **📊 Dynamic Role Scoring:** Upload your squad view exported from Football Manager (`.html` file) and instantly see a score for each player in your selected roles.
*   **✍️ Fully Editable Role Weights:**
    *   Don't agree with the default attribute weights? **Edit any role** to match your tactical philosophy.
    *   **Reset a single role** to its default value if you make a mistake.
    *   **Reset ALL roles** to their original defaults with a single click.
*   **🚀 100% Offline Functionality:**
    *   After the first load, the application works entirely offline. No internet connection needed.
    *   All your edited role weights are saved locally in your browser's `localStorage`.
*   **🔍 Advanced Player Analysis Tools:**
    *   **Player Comparison:** Select 2-4 players from the results table to compare their attributes and role scores side-by-side in a detailed view.
    *   **Contextual Comparison:** Filter the comparison view to show only the most relevant attributes for a specific role.
    *   **Advanced Table Filtering:** Filter the main results table by any column (e.g., show players with Age < 23 and Best Score > 15).
*   **📋 Tactical Presets:**
    *   Save your favorite combinations of selected roles as a "Tactic Preset".
    *   Load your presets with one click to quickly analyze your squad for different tactical setups.
*   **🖥️ Focus Mode:**
    *   Expand the results table to a **fullscreen view** to eliminate distractions and focus on data analysis.
*   **🔄 Live Recalculation:**
    *   Scores are automatically recalculated in real-time whenever you edit or reset role weights, no need to re-upload your file.

---

## 🛠️ How to Use

The application is designed to be simple and intuitive.

1.  **Select Roles:**
    *   Click the `+ Add` button in the **"1. Select Roles"** card.
    *   A modal will appear with a list of all available roles. Select the roles you want to analyze.
    *   *Pro Tip:* Use the **Role Presets** feature at the bottom of the card to save and load your favorite role combinations.

2.  **Upload Player Data:**
    *   In Football Manager, go to your squad view. Make sure the view contains all the necessary attributes. (A pre-configured view is available for download via the "Download Views" button).
    *   Go to `File > Print Screen` and choose to export as a "Web Page (*.html)".
    *   Back in the tool, click `Choose File` in the **"2. Upload Player Data"** card and select the `.html` file you just exported.
    *   Click `Process File`.

3.  **Analyze Players:**
    *   The results will appear in the **"3. Analyze Players"** table.
    *   Use the search bar, advanced column filters, and sorting to analyze your squad.
    *   Select multiple players using the checkboxes and click the `Compare Selected` button to see a side-by-side comparison.
    *   Click the fullscreen icon in the card header to enter Focus Mode.

---

## 🚀 Deployment & Offline Usage

This application is built to be fully self-contained and does not require a server to run.

*   **Offline Use:** Simply download the project folder, and open the `index.html` file in your browser. All features will work.
*   **Online Deployment:** The project is a static site. It can be deployed to any static hosting service like **Vercel**, **Netlify**, or **GitHub Pages** with zero configuration.

---

## 🔧 Built With

*   [Bootstrap 5](https://getbootstrap.com/) - For the responsive UI framework.
*   [Bootstrap Icons](https://icons.getbootstrap.com/) - For a clean and consistent set of icons.
*   [jQuery](https://jquery.com/) - For DOM manipulation and event handling.
*   [Bootstrap Table](https://bootstrap-table.com/) - For the powerful, feature-rich data table.

---

## 🙏 Acknowledgements

A huge thank you to the original creators whose work provided the foundation and inspiration for this project:

*   **Fatheed7**
*   **HarrisonRClark**

Their initial projects demonstrated the power of a client-side tool for FM analysis, and this version aims to build upon that with a modernized UI and expanded feature set.

---
*This tool is a fan-made project and is not officially affiliated with Football Manager or Sports Interactive.*
