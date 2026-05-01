#!/bin/python

import sys, subprocess, os, os.path, yaml;

jellyconfFile = sys.argv[1]
with open(jellyconfFile, 'r') as file:
    config = yaml.safe_load(file)

def _fetchDir(dirName, dir):
    type = 'root'
    os.chdir(dirName)
    for key, value in dir.items():
        match key:
            case 'type':
                type = value
            case 'downloaded':
                if (value == 1): 
                    return
            case 'logo':
                if (os.path.isfile('primary'):
                    os.remove('primary')
                subprocess.run(['curl', '-o', './primary', value])
            case 'url':
                print('Downloading music')
                print(os.getcwd())
                print(value)
                print()
                commandArr = ['yt-dlp', '-t', 'mp3', value]
                if (len(sys.argv) == 3):
                    commandArr.insert(2, sys.argv[2])
                    commandArr.insert(2, '--cookies');
                subprocess.run(['yt-dlp', '-t', 'mp3', value])
            case _:
                os.mkdir(key)
                print(value)
                if (value): 
                    _fetchDir(key, value[0])
                    os.chdir('..')
    return

_fetchDir('.', config)
