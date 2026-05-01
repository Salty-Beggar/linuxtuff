#!/bin/python
import os
import random
import time
import subprocess
import sys

interval = (float) (sys.argv[1])
while True:
    wallpaperDir = os.getenv("SWITCHING_WALLPAPER_DIR")

    os.chdir(wallpaperDir)
    files = os.listdir(wallpaperDir)
    random.shuffle(files)
    curIndex = 0
    for img in files:
        time.sleep(interval)
        command = f"DP-1, ./{img}"
        subprocess.run(["hyprctl", "hyprpaper", "wallpaper", command]) 

