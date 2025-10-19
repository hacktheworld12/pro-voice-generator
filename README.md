<div align="center">
  <h1 align="center">🔊 Pro Voice Generator</h1>
  <p align="center">
    <strong>Craft professional, AI-powered voiceovers with granular control over performance, effects, and music.</strong>
  </p>
  
  <!-- Shields.io Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini API">
  </p>
  
  <p align="center">
    <a href="#-key-features">Key Features</a>
    ·
    <a href="#-how-it-works">How It Works</a>
    ·
    <a href="#-local-installation">Installation</a>
    ·
    <a href="#-tech-stack">Tech Stack</a>
  </p>
</div>

> **Pro Voice Generator** is a sophisticated web application that leverages the power of Google's Gemini Text-to-Speech API to transform text into high-quality, emotionally resonant English voiceovers. It provides a user-friendly interface with a suite of professional controls, allowing users to meticulously direct the voice performance, apply studio-grade effects, and mix in background music for a complete audio production.



---

## ✨ Key Features

| Feature                 | Description                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 🎤 **Dynamic Performance** | Direct the AI's emotional tone (`Confident`, `Calm`, `Energetic`), vocal intensity, and acoustic environment (`Studio`, `Hall`).      |
| 🎛️ **Studio Effects**      | Apply professional audio effects like **Reverb** and **Echo** to add depth, and a **Noise Gate** for crystal-clear silence.          |
| 🎵 **Background Music**    | Layer your voiceover with a selection of music styles (`Cinematic`, `Piano`, `Ambient`) and control the mix with a volume slider.      |
| ▶️ **Advanced Playback**   | Fine-tune the listening experience with playback speed controls (`0.5x` to `2x`) and a precise volume slider.                         |
| 💾 **Session Persistence** | Your last generated voiceover and all its settings are automatically saved, letting you pick up exactly where you left off.          |

---

## ⚙️ How It Works

The magic of this application lies in its advanced prompt engineering, which translates your selections into a detailed set of instructions for the Gemini model.

1.  **✍️ User Input**: You enter text and select your desired parameters from the UI—emotional tone, intensity, reverb, background music, etc.
2.  **🧠 Prompt Construction**: A highly detailed, structured prompt is dynamically built in the background. This prompt acts as a director's brief for a "world-class audio engineer and voice actor."
3.  **🚀 Gemini API Call**: The complex prompt is sent to the `gemini-2.5-flash-preview-tts` model, requesting an audio response with a specific professional voice.
4.  **🎧 Audio Processing**: The API returns raw PCM audio data (base64-encoded). The app decodes this data in the browser.
5.  **🔊 Instant Playback**: Using the Web Audio API, the raw data is converted into a standard `.wav` file and made instantly playable, no downloads required.

---

## 🚀 Local Installation

Get a copy of the project up and running on your local machine.

### Prerequisites

-   [Git](https://git-scm.com/) installed.
-   [Node.js](https://nodejs.org/) (which includes `npm`) installed.
-   A **Google Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

### 🖥️ For PC (Windows, macOS, Linux)

1.  **Clone the repository:**
    Open your terminal and run the following command. This will download the project files from the `hacktheworld12` GitHub account.
    ```bash
    git clone https://github.com/hacktheworld12/pro-voice-generator.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd pro-voice-generator
    ```

3.  **Install all required packages:**
    ```bash
    npm install
    ```

4.  **Set up your API Key:**
    Create a new file named `.env` in the root of the project. This file will store your secret API key.
    ```bash
    # For Windows (Command Prompt)
    echo API_KEY="YOUR_GEMINI_API_KEY_HERE" > .env
    
    # For macOS/Linux
    echo 'API_KEY="YOUR_GEMINI_API_KEY_HERE"' > .env
    ```
    *Replace `"YOUR_GEMINI_API_KEY_HERE"` with your actual key.*

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will launch the app. Open your browser and go to `http://localhost:5173`.

---

### 📱 For Termux (Android)

Run the development server on your Android device using the Termux terminal.

1.  **Install necessary packages:**
    Open Termux and install `git` and `nodejs`.
    ```bash
    pkg update && pkg upgrade
    pkg install git nodejs -y
    ```

2.  **Clone the repository:**
    ```bash
    git clone https://github.com/hacktheworld12/pro-voice-generator.git
    cd pro-voice-generator
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up your API Key:**
    You can use the `nano` text editor to create your `.env` file.
    ```bash
    nano .env
    ```
    Inside the editor, add this line, replacing the placeholder with your key:
    ```
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```
    Press `Ctrl+X`, then `Y`, then `Enter` to save and close the file.

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open a browser on your phone and navigate to `http://localhost:5173` to see the app running.

---

## 🛠️ Tech Stack

-   **Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Model**: Google Gemini (`gemini-2.5-flash-preview-tts`)
-   **API Client**: [`@google/genai`](https://www.npmjs.com/package/@google/genai) SDK
-   **Audio Engine**: Browser's native [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for real-time decoding and processing.

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Powered by <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">Google Gemini</a>
</p>
