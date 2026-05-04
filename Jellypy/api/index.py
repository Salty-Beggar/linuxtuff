from flask import Flask, make_response, request
import yaml, os, json, jellyconf

app = Flask(__name__)

@app.get("/jellyconf")
def getJellyconf():
    return jellyconf.get()

@app.post("/jellyconf")
def addJellyconf():
    return jellyconf.add()

@app.put("/jellyconf")
def updateJellyconf():
    return jellyconf.update()

@app.post('/jellyconf/download')
def downloadJellyconf():
    return jellyconf.download()