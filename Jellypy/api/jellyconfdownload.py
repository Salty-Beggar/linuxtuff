
import sys, subprocess, os, os.path, yaml, traceback, json;

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

def fetchJellyconfResponse():
    jellyconf = fetchJellyconf()
    jellyconfResponse = []
    def _buildResponse(folder: dict):
        responseArr = []
        for key, value in folder.items():
            if (key in JellyconfAttribute.ATTRIBUTES):
                continue
            newResponse = {
                'title': key,
                'items': []
            }
            for subKey, subValue in value[0].items():
                if (subKey in JellyconfAttribute.ATTRIBUTES):
                    newResponse[subKey] = subValue
                else:
                    print('====', subValue[0])
                    newResponse['items'] = _buildResponse(value[0])
            responseArr.append(newResponse)
        return responseArr
    jellyconfResponse = _buildResponse(jellyconf)
    return jellyconfResponse


    


def dumpToJellyconf(newJellyconf):
    jellyconfPath = getJellyconfPath()
    with (open(jellyconfPath, 'w') as jellyconfFile):
        yaml.dump(newJellyconf, jellyconfFile)

class JellyconfAttribute:
    ATTRIBUTES = ['url', 'logo', 'type', 'status']
    URL = 'url'
    LOGO = 'logo'
    TYPE = 'type'
    STATUS = 'status'
    STATUS_DOWNLOADED = 1
    STATUS_NOTDOWNLOADED = 2
    STATUS_REMOVE = 3

def download():
    print('\n\n\nSTARTING DOWNLOAD!!!\n')
    try:
        type = 'root'
        jellyconf = fetchJellyconf()
        def _download(namespace: dict, namespaceDir):
            doDownload: bool = ((not JellyconfAttribute.STATUS in namespace)
                or namespace[JellyconfAttribute.STATUS] == JellyconfAttribute.STATUS_NOTDOWNLOADED)
            if (JellyconfAttribute.TYPE in namespace): type = namespace[JellyconfAttribute.TYPE]
            os.chdir(namespaceDir)
            for key, value in namespace.items():
                match (key):
                    case JellyconfAttribute.URL:
                        if (not doDownload): continue
                        commandArr = ['yt-dlp', '-t', 'mp3', value]
                        if (config['cookies']['active']):
                            commandArr.insert(2, config['cookies']['file'])
                            commandArr.insert(2, '--cookies')
                        subprocess.run(['yt-dlp', '-t', 'mp3', value])
                    case JellyconfAttribute.LOGO:
                        if (not doDownload): continue
                        if (os.path.isfile('folder.png')):
                            os.remove('folder.png')
                        subprocess.run(['curl', '-o', './folder.png', value])
                    case _:
                        if (key in JellyconfAttribute.ATTRIBUTES): continue
                        if (not os.path.isdir(key)): 
                            os.mkdir(key)
                        if (value): 
                            _download(value[0], key)
                            os.chdir('..')
        _download(jellyconf, config['path'])
    except Exception as e:
        traceback.print_exc()
        return [False, 'Oops! Something occurred!']
    return [True, 'Download succesful!']

            
            
