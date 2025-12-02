import cv2
import mediapipe as mp
import random
import math
import time
import numpy as np
import sys

print("\n--- CAMERA SELECTION ---")
print("1. Integrated / USB Camera (Webcam)")
print("2. IP Webcam (Phone App)")
choice = input("Enter your choice (1 or 2): ").strip()

video_source = 0 

if choice == '2':
    print("\n--- IP WEBCAM CONFIGURATION ---")
    print("1. Connect your phone to the same wifi of your device running the code ")
    print("2. Open 'IP Webcam' app on phone -> Start Server")
    print("3. Find the IPv4 address (e.g., http://192.168.1.34:8080)")
    user_url = input("Enter URL (make sure to include http:// and /video at end): ").strip()
    
    if not user_url.startswith("http"):
        user_url = "http://" + user_url
    if not user_url.endswith("/video"):
         print("Adding '/video' to the URL for you...")
         user_url = user_url.rstrip("/") + "/video"
         
    video_source = user_url
else:
    idx_input = input("Enter Camera Index (Press Enter for default '0'): ").strip()
    if idx_input.isdigit():
        video_source = int(idx_input)

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# INCREASED CONFIDENCE TO 0.8 TO PREVENT GLITCHES
hands = mp_hands.Hands(
    model_complexity=0,
    min_detection_confidence=0.8, 
    min_tracking_confidence=0.8
)

print(f"\nAttempting to connect to: {video_source}")
cap = cv2.VideoCapture(video_source)

if not cap.isOpened():
    print(f"\n[ERROR] Could not open video source: {video_source}")
    print("--------------------------------------------------")
    print("TROUBLESHOOTING:")
    print("1. If on Linux/Laptop: Try using Index '1' or '2' instead of '0'.")
    print("2. If using IP Webcam: Ensure the phone is on the same Wi-Fi and the URL ends in '/video'.")
    print("3. Check if another app (Zoom/Teams) is using the camera.")
    print("--------------------------------------------------")
    sys.exit() 

current_state = "MENU"
score = 0
start_time = 0
initial_game_duration = 30
game_duration = initial_game_duration
time_bonus = 2 

color_mode = False 

dots = []          
connected_indices = []
dot_radius = 20
colors_list = [(255, 0, 0), (0, 255, 0), (0, 0, 255), (0, 255, 255)]
target_color = None 

def spawn_dots(width, height, count, multi_color=False):
    new_dots = []
    # INCREASED MARGIN TO KEEP DOTS AWAY FROM EDGES
    margin = 350 
    
    round_target = None
    if multi_color:
        round_target = random.choice(colors_list)

    for i in range(count):
        # Safety check to ensure margin isn't larger than screen
        x_min = margin
        x_max = max(margin + 1, width - margin)
        y_min = margin
        y_max = max(margin + 1, height - margin)

        x = random.randint(x_min, x_max)
        y = random.randint(y_min, y_max)
        
        if multi_color:
            if i < 3:
                color = round_target
            else:
                color = random.choice(colors_list)
        else:
            color = (0, 165, 255) 
            
        new_dots.append({'pos': (x, y), 'color': color})
        
    return new_dots, round_target

class Button:
    def __init__(self, text, pos, size=(220, 60), color=(50, 50, 50), text_color=(255, 255, 255)):
        self.text = text
        self.pos = pos
        self.size = size
        self.color = color
        self.text_color = text_color
        self.hover_counter = 0
        self.hover_threshold = 15
        
    def draw(self, img):
        x, y = self.pos
        w, h = self.size
        progress = self.hover_counter / self.hover_threshold
        b = int(self.color[0] * (1 - progress))
        g = int(self.color[1] + (255 - self.color[1]) * progress)
        r = int(self.color[2] * (1 - progress))
        
        cv2.rectangle(img, (x, y), (x + w, y + h), (b, g, r), -1)
        cv2.rectangle(img, (x, y), (x + w, y + h), (200, 200, 200), 2)
        
        text_size = cv2.getTextSize(self.text, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
        text_x = x + (w - text_size[0]) // 2
        text_y = y + (h + text_size[1]) // 2
        cv2.putText(img, self.text, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, self.text_color, 2)

    def check_hover(self, fx, fy):
        x, y = self.pos
        w, h = self.size
        if x < fx < x + w and y < fy < y + h:
            self.hover_counter += 1
            if self.hover_counter >= self.hover_threshold:
                self.hover_counter = 0
                return True
        else:
            self.hover_counter = max(0, self.hover_counter - 1)
        return False

# CENTERED BUTTONS (Assuming 1920 width, center x ~ 850)
btn_play = Button("START GAME", (850, 300))
btn_settings = Button("SETTINGS", (850, 400))
btn_quit = Button("QUIT", (850, 500))

# Moved EXIT button inwards
btn_exit_game = Button("EXIT", (100, 50), size=(100, 40), color=(50, 50, 200))
btn_retry = Button("PLAY AGAIN", (850, 600)) 

btn_color_mode = Button("COLOR MODE: OFF", (850, 350))
btn_back = Button("BACK", (850, 550))

window_name = 'IP Webcam Game'
cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
cv2.setWindowProperty(window_name, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

print("Connected! Press 'q' to exit.")

while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("Failed to read stream.")
        break

    image = cv2.flip(image, 1)

    image = cv2.resize(image, (1920, 1080))
    
    h, w, _ = image.shape
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(image_rgb)
    
    fx, fy = 0, 0
    hand_detected = False

    if results.multi_hand_landmarks:
        hand_detected = True
        # Grab only the first hand [0] to prevent cursor jumping
        hand_landmarks = results.multi_hand_landmarks[0]
        
        mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
        index_tip = hand_landmarks.landmark[8]
        fx, fy = int(index_tip.x * w), int(index_tip.y * h)
        cv2.circle(image, (fx, fy), 10, (255, 255, 0), -1)

    if current_state == "MENU":
        # Reset positions ensuring they are centered
        btn_play.pos = (850, 300)
        btn_quit.pos = (850, 500)

        # Draw Title Centered
        text = "DOT CONNECTOR"
        text_size = cv2.getTextSize(text, cv2.FONT_HERSHEY_DUPLEX, 2, 2)[0]
        text_x = (w - text_size[0]) // 2
        cv2.putText(image, text, (text_x, 200), cv2.FONT_HERSHEY_DUPLEX, 2, (255, 255, 255), 2)
        
        btn_play.draw(image)
        btn_settings.draw(image)
        btn_quit.draw(image)
        
        if hand_detected:
            if btn_play.check_hover(fx, fy):
                current_state = "PLAYING"
                score = 0
                start_time = time.time()
                game_duration = initial_game_duration 
                count = 5 if color_mode else 3
                dots, target_color = spawn_dots(w, h, count, color_mode)
                connected_indices = []
            elif btn_settings.check_hover(fx, fy):
                current_state = "SETTINGS"
            elif btn_quit.check_hover(fx, fy):
                break
                
    elif current_state == "SETTINGS":
        text = "SETTINGS"
        text_size = cv2.getTextSize(text, cv2.FONT_HERSHEY_DUPLEX, 2, 2)[0]
        text_x = (w - text_size[0]) // 2
        cv2.putText(image, text, (text_x, 200), cv2.FONT_HERSHEY_DUPLEX, 2, (255, 255, 255), 2)

        btn_color_mode.draw(image)
        btn_back.draw(image)

        if hand_detected:
            if btn_color_mode.check_hover(fx, fy):
                color_mode = not color_mode
                btn_color_mode.text = f"COLOR MODE: {'ON' if color_mode else 'OFF'}"
            elif btn_back.check_hover(fx, fy):
                current_state = "MENU"

    elif current_state == "PLAYING":
        elapsed = time.time() - start_time
        remaining = max(0, game_duration - elapsed)
        
        if remaining == 0:
            current_state = "GAME_OVER"
        
        # MOVED HUD INWARDS
        cv2.putText(image, f"Time: {int(remaining)}s", (w - 350, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(image, f"Score: {score}", (w - 350, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        if color_mode and target_color:
            cv2.putText(image, "Target:", (w - 350, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.circle(image, (w - 230, 175), 15, target_color, -1)
        
        btn_exit_game.draw(image)
        if hand_detected and btn_exit_game.check_hover(fx, fy):
            current_state = "MENU"

        if hand_detected:
            for i, dot in enumerate(dots):
                if i not in connected_indices:
                    if color_mode and dot['color'] != target_color:
                        continue
                        
                    dist = math.sqrt((fx - dot['pos'][0])**2 + (fy - dot['pos'][1])**2)
                    if dist < dot_radius + 15:
                        connected_indices.append(i)

        target_dot_count = len(dots)
        if color_mode:
            target_dot_count = sum(1 for d in dots if d['color'] == target_color)

        if len(connected_indices) == target_dot_count and target_dot_count > 0:
            score += 10 + target_dot_count
            game_duration += time_bonus
            start_time = time.time() - (game_duration - remaining - time_bonus)

            new_count = min(8, 3 + (score // 50))
            if color_mode: new_count += 3 
            dots, target_color = spawn_dots(w, h, new_count, color_mode)
            connected_indices = []
        
        line_color = target_color if color_mode else (0, 255, 0)
        
        if len(connected_indices) > 0:
            for i in range(len(connected_indices) - 1):
                pt1 = dots[connected_indices[i]]['pos']
                pt2 = dots[connected_indices[i+1]]['pos']
                cv2.line(image, pt1, pt2, line_color, 5)
            
            last_dot_pos = dots[connected_indices[-1]]['pos']
            cv2.line(image, last_dot_pos, (fx, fy), line_color, 2)

        for i, dot in enumerate(dots):
            pos = dot['pos']
            color = dot['color']
            
            if i in connected_indices:
                cv2.circle(image, pos, dot_radius + 5, (255, 255, 255), 2) 

            cv2.circle(image, pos, dot_radius, color, -1)
    
    elif current_state == "GAME_OVER":
        overlay = image.copy()
        cv2.rectangle(overlay, (0, 0), (w, h), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.7, image, 0.3, 0, image)

        cv2.putText(image, "TIME'S UP!", (w//2 - 150, h//2 - 100), cv2.FONT_HERSHEY_DUPLEX, 1.5, (0, 0, 255), 3)
        cv2.putText(image, f"Final Score: {score}", (w//2 - 120, h//2), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        btn_retry.pos = (w//2 - 110, h//2 + 50)
        btn_retry.draw(image)
        btn_quit.pos = (w//2 - 110, h//2 + 130)
        btn_quit.draw(image)

        if hand_detected:
            if btn_retry.check_hover(fx, fy):
                current_state = "PLAYING"
                score = 0
                start_time = time.time()
                game_duration = initial_game_duration 
                count = 5 if color_mode else 3
                dots, target_color = spawn_dots(w, h, count, color_mode)
                connected_indices = []
            elif btn_quit.check_hover(fx, fy):
                break

    cv2.imshow(window_name, image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
