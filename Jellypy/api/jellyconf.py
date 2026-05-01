from flask import make_response, request
import yaml, os, json

with open('config.yaml') as configFile:
    config = yaml.safe_load(configFile)

def getJellyconfPath():
    return os.path.join(config['path'], f'{config['jellyconfName']}.yaml')

def fetchJellyconf():
    jellyconfPath = getJellyconfPath()
    if (os.path.isfile(jellyconfPath)):
        with (open(jellyconfPath, 'r')) as jellyconfFile:
            jellyconf = yaml.safe_load(jellyconfFile)
    else:
        jellyconf = []
    return jellyconf

def dumpToJellyconf(newJellyconf):
    jellyconfPath = getJellyconfPath()
    with (open(jellyconfPath, 'w') as jellyconfFile):
        yaml.dump(newJellyconf, jellyconfFile)


def get():
    return make_response(fetchJellyconf(), 200)

def _add(newConf, addConf):
    for key, value in addConf.items():
        if (not key in newConf):
            newConf[key] = {'downloaded': False}
        _add(newConf[key], addConf[key])

def add():
    jellyconf = fetchJellyconf()
    newJellyconf = jellyconf.copy()
    addJellyconf = request.get_json()
    _add(newJellyconf, addJellyconf)
    dumpToJellyconf(newJellyconf)
    
    return make_response(json.dumps(newJellyconf), 200)


