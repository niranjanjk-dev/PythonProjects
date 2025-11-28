import cv2
import imutils

# ---------------------------------------------------------
# REPLACE THIS with the IP address shown on your phone screen
# Note: Keep the "/video" at the end!
URL = "http://172.17.39.9:8080/video"
# ---------------------------------------------------------

# Open the IP stream
cap = cv2.VideoCapture(URL)

if not cap.isOpened():
    print("Error: Could not connect to phone. Check IP address and WiFi.")
    exit()

print("Connected! Press 'q' to exit.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Resize for better performance (Optional)
    frame = imutils.resize(frame, width=800)

    # Show the video
    cv2.imshow("Android Phone Cam", frame)

    # Exit on 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

