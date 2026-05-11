import cv2

def check_web_compatibility(file_path):
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        return "Error: Cannot open video"
    
    # Get FourCC
    fourcc = int(cap.get(cv2.CAP_PROP_FOURCC))
    codec = "".join([chr((fourcc >> 8 * i) & 0xFF) for i in range(4)])
    
    # Get other vital stats
    width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    
    cap.release()
    
    print(f"Codec: {codec}")
    print(f"Resolution: {int(width)}x{int(height)}")
    print(f"Total Frames: {int(frames)}")
    
    if codec.lower() not in ['avc1', 'mp4v']:
        print("Warning: This codec may not support browser previews.")
    if frames == 0:
        print("Warning: Video appears to have no frames (corrupt export).")

check_web_compatibility("test_videos/minor.mp4")
import subprocess

def convert_for_web(input_file, output_file):
    command = [
        'ffmpeg', '-y', '-i', input_file,
        '-c:v', 'libx264', 
        '-pix_fmt', 'yuv420p', # Critical for browsers
        '-movflags', '+faststart', # Allows preview before full download
        output_file
    ]
    subprocess.run(command)
convert_for_web("test_videos\major.mp4", "test_videos\major1.mp4")