import { useContext, type CSSProperties } from "react";
import type { Directory } from "../../../types/jellyconf";
import { Context } from "../Body";

export default function Directory({}: {}) {
    const { jellyconf, setJellyconf } = useContext(Context);
    console.log(jellyconf);
    return (
        <div>
            <FolderList hierarchy={0} directories={jellyconf} parent={'root'} />
        </div>
    );
}

function FolderList({hierarchy, directories, parent}: {hierarchy: number, directories: Directory[], parent: Directory|'root'}) {
    return (
        <>
        {directories.map((dir, index) => (<Folder key={index} hierarchy={hierarchy} directory={dir}/>))}
        <FolderAdd hierarchy={hierarchy} directory={parent}/>
        </>
    );
}

function Folder({hierarchy, directory}: {hierarchy: number, directory: Directory}) {

    const { jellyconf, setJellyconf } = useContext(Context);

    const {title, logo} = directory;

    const style: CSSProperties = {
        marginLeft: `${hierarchy*30}px`,
        borderRadius: 10,
        backgroundColor: "black",
        color: 'white',
        display: 'flex',
        gap: 10,
        marginBottom: '10px',
        flexDirection: 'column',
        padding: '5px',
        alignItems: 'stretch',
        textAlign: 'left'
    };
    const imgStyle: CSSProperties = {
        height: "80px",
        width: '80px'
    }
    const titleStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between'
    }

    // function jellyconfSetAttribute(title: string, attribute: keyof Directory, newValue: string) {
    //     setJellyconf([...jellyconf.map((e) => {
    //         if (e.title === title) {
    //             directory[attribute] = newValue;
    //         }
    //         return e;
    //     })]);
    // }

    return (
        <>
        <div style={style}>
            <h2 style={titleStyle}>
                {title}
                <img src={logo} alt={title} style={imgStyle} />
            </h2>
            <label>Título</label>
            <input type='text' defaultValue={directory.title} onChange={(input) => { 
                function _map(e: Directory) {
                    e.items = e.items?.map(_map);
                    if (e.title === title) {
                        directory.title = input.target.value;
                    }
                    return e;
                };
                setJellyconf([...jellyconf.map((e) => _map(e))]);
            }}></input>

            <label>Downloaded?</label>
            <select defaultValue={directory.downloaded ? '1' : '0'} onChange={(input) => { 
                function _map(e: Directory) {
                    e.items = e.items?.map(_map);
                    if (e.title === title) {
                        directory.downloaded = input.target.value == '1';
                    }
                    return e;
                };
                setJellyconf([...jellyconf.map((e) => _map(e))]);
            }}>
                <option key={1}>Sim</option>
                <option key={0}>Não</option>
            </select>

            <label>Tipo</label>
            <select defaultValue={directory.type} onChange={(input) => { 
                function _map(e: Directory) {
                    e.items = e.items?.map(_map);
                    if (e.title === title) {
                        directory.type = input.target.value as 'album'|'artist';
                    }
                    return e;
                };
                setJellyconf([...jellyconf.map((e) => _map(e))]);
            }}>
                <option key='album'>Álbum</option>
                <option key='artist'>Artista</option>
            </select>

            <label>Logo</label>
            <input type='text' defaultValue={directory.logo} onChange={(input) => { 
                function _map(e: Directory) {
                    e.items = e.items?.map(_map);
                    if (e.title === title) {
                        directory.logo = input.target.value;
                    }
                    return e;
                };
                setJellyconf([...jellyconf.map((e) => _map(e))]);
            }}></input>

            <label>URL</label>
            <input type='text' defaultValue={directory.url} onChange={(input) => { 
                function _map(e: Directory) {
                    e.items = e.items?.map(_map);
                    if (e.title === title) {
                        directory.url = input.target.value;
                    }
                    return e;
                };
                setJellyconf([...jellyconf.map((e) => _map(e))]);
            }}></input>
        </div>
        {
            (directory.items) ? (<FolderList hierarchy={hierarchy+1} directories={directory.items} parent={directory} />) : ''
        }
        </>
    );
}

function FolderAdd({ hierarchy, directory }:{ hierarchy: number, directory: Directory|'root'}) {

    const { jellyconf, setJellyconf } = useContext(Context);

    const style: CSSProperties = {
        marginLeft: `${hierarchy*30}px`,
        marginBottom: '5px',
        borderRadius: '5px',
        backgroundColor: 'green',
        flexDirection: 'column',
        padding: '5px',
        alignItems: 'stretch',
    }
    function onClick() {
        if (directory === 'root') {
            const newJellyconf = jellyconf;
            jellyconf.push({
                title: Date.now().toString(),
                type: 'album',
                downloaded: false
            });
            setJellyconf([...jellyconf]);
        }else {
            const directoryT = directory as Directory;
            function _map(e: Directory) {
                if (e.title === directoryT.title) {
                    if (e.items) {
                        e.items.push({
                            title: Date.now().toString(),
                            type: 'album',
                            downloaded: false
                        });
                    }else {
                        e.items = [
                            {
                                title: Date.now().toString(),
                                type: 'album',
                                downloaded: false
                            }
                        ];
                    }
                }else e.items?.map(_map);
                return e;
            }
            setJellyconf([...jellyconf.map(_map)]);
        }
    }
    return (
        <>
            <button style={style} onClick={onClick}>
                Adicionar pasta
            </button>
        </>
    );
}
