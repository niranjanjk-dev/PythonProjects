# Dot Connector: Hand Gesture Controlled AR Game

**Dot Connector** is a real-time Augmented Reality (AR) game built with Python, OpenCV, and MediaPipe. It turns your webcam into a touchless interface, allowing you to control a cursor with your index finger to navigate menus and play a "connect-the-dots" speed game.

## 🎮 Features

* **Touchless Interface:** Control the entire application using only hand gestures (index finger tracking).
* **Hover-to-Click:** Robust UI interaction that prevents accidental clicks by requiring a "dwell time" on buttons.
* **Dual Camera Support:**
  * **USB Webcam:** Works with standard integrated laptop cameras or external USB webcams.
  * **IP Webcam:** Supports high-quality video streams from your smartphone via Wi-Fi (using apps like "IP Webcam" for Android).
* **Game Modes:**
  * **Standard Mode:** Connect all orange dots as fast as possible.
  * **Color Match Mode:** A cognitive challenge where you must filter distractions and connect only dots of a specific target color (Red, Green, Blue, Yellow).
* **Dynamic Difficulty:** The game spawns more dots and adds time bonuses as you clear levels.
* **Robust Tracking:** Optimized for stability with high confidence thresholds to prevent "ghost touches" and jitter.

## 🛠️ Prerequisites

### Hardware

* A computer (Windows/Linux/macOS) capable of running Python.
* A Webcam **OR** an Android/iOS smartphone connected to the same Wi-Fi network.

### Software

* Python 3.8 or higher.

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/dot-connector.git](https://github.com/yourusername/dot-connector.git)
   cd dot-connector
   ```

2. **Install dependencies:**
   It is recommended to use a virtual environment.
   ```bash
   pip install opencv-python mediapipe numpy
   ```

## 🚀 How to Run

1. **Start the script:**
   ```bash
   python main.py
   ```

2. **Select your Camera:**
   The terminal will prompt you to choose a video source:
   * **Option 1 (Integrated Camera):** Use this for standard laptop webcams. You may be asked for an index (usually `0` or `1`).
   * **Option 2 (IP Webcam):** Use this if connecting a phone. You will need to enter the URL provided by your IP Webcam app (e.g., `http://192.168.1.5:8080/video`).

## 🕹️ How to Play

1. **Navigation:**
   * Move your hand so your index finger hovers over a button.
   * **Hold it there** until the button fills up (turns green) to select it.

2. **The Game:**
   * **Objective:** Connect the dots!
   * Move your index finger close to a dot to "pick it up".
   * A line will form connecting the dots you have visited.
   * Once all required dots are connected, the level clears, and you gain a time bonus.

3. **Color Mode (Settings):**
   * Go to **SETTINGS** and enable **COLOR MODE**.
   * Look at the **Target** indicator in the top-right corner.
   * **Only** connect dots that match the target color. Connecting a wrong color will simply be ignored.

## 🔧 Troubleshooting

* **Error: Camera index out of range**
  * This is common on Linux laptops with IR sensors. Try restarting the script and entering `1` or `2` when asked for the Camera Index.
* **Error: Failed to open IP Webcam**
  * Ensure your phone and computer are on the **same Wi-Fi network**.
  * Make sure the URL includes `http://` at the start and `/video` at the end.
* **Hand not detected / Jittery cursor**
  * Ensure your hand is well-lit.
  * Keep your hand within the central "playable area" (don't go too close to the edges of the screen).
  * The system is optimized to track **one hand** at a time. Ensure no other people are waving in the background.

## 🏗️ Tech Stack

* [**OpenCV**](https://opencv.org/): Video capture, image processing, and rendering.
* [**MediaPipe**](https://google.github.io/mediapipe/): High-fidelity, low-latency hand tracking.
* [**NumPy**](https://numpy.org/): Efficient array manipulations.

## 📄 License

This project is open-source and available under the MIT License.
