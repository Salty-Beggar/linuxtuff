from flask import make_response, request
from jellyconfdownload import JellyconfAttribute
import yaml, os, json, jellyconfdownload

# with open('config.yaml') as configFile:
#     config = yaml.safe_load(configFile)

# def getJellyconfPath():
#     return os.path.join(config['path'], f'{config['jellyconfName']}.yaml')

# def fetchJellyconf():
#     jellyconfPath = getJellyconfPath()
#     if (os.path.isfile(jellyconfPath)):
#         with (open(jellyconfPath, 'r')) as jellyconfFile:
#             jellyconf = yaml.safe_load(jellyconfFile)
#     else:
#         jellyconf = []
#     return jellyconf

# def dumpToJellyconf(newJellyconf):
#     jellyconfPath = getJellyconfPath()
#     with (open(jellyconfPath, 'w') as jellyconfFile):
#         yaml.dump(newJellyconf, jellyconfFile)

def get():
    return make_response(jellyconfdownload.fetchJellyconfResponse(), 200)

def _add(newConf, addConf, isAdd):
    for key, value in addConf.items():
        if (key in JellyconfAttribute.ATTRIBUTES):
            if (isAdd): newConf[key] = addConf[key]
        else:
            if (not key in newConf):
                newConf[key] = {'downloaded': False}
                _add(newConf[key], addConf[key], True)
            else:
                _add(newConf[key], addConf[key], isAdd)

def add():
    jellyconf = jellyconfdownload.fetchJellyconf()
    newJellyconf = jellyconf.copy()
    addJellyconf = request.get_json()

    _add(newJellyconf, addJellyconf, False)

    jellyconfdownload.dumpToJellyconf(newJellyconf)
    
    return make_response(json.dumps(newJellyconf), 200)

def _update(newConf, modConf):
    for key, value in modConf.items():
        if (key in JellyconfAttribute.ATTRIBUTES):
            if (key in newConf): newConf[key] = modConf[key]
        else:
            if (key in newConf):
                _update(newConf[key], modConf[key])


def update():
    jellyconf = jellyconfdownload.fetchJellyconf()
    newJellyconf = jellyconf.copy()
    addJellyconf = request.get_json()
    _update(newJellyconf, addJellyconf)
    jellyconfdownload.dumpToJellyconf(newJellyconf)
    
    return make_response(json.dumps(newJellyconf), 200)

def download():
    response = jellyconfdownload.download()
    return make_response(response[1], 200 if response[0] else 400)
