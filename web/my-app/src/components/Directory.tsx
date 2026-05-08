import { createContext, useContext, useEffect, useState, type CSSProperties } from "react";

const DirectoryContext = createContext({});

export default function Directory() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [json, setJson] = useState({});

    useEffect(() => {
        // Fetch the API
    });

    return (
        <>
            <DirectoryContext value={setJson}>
                <DirectoryLevel level={/* Supply value */} />
            </DirectoryContext>
        </>
    );
}

type DirLevel = {
    id: number,
    title: string,
    type: 'artist'|'album',
    logo: string,
    url: string,
    level: DirLevel[]
}

function DirectoryLevel({ level, hierarchy }: { level: DirLevel[], hierarchy: number }) {
    return (
        <>
            {
            level.map((dirLevel, index) => (
                <DirectoryFolder 
                key={index} 
                level={dirLevel} 
                hierarchy={hierarchy} 
                />
            )
            )}
        </>
    );
}

function DirectoryFolder({ level, hierarchy, state }: {level: DirLevel, hierarchy: number, state }) {
    const style: CSSProperties = {
        backgroundColor: 'black',
        borderRadius: '10px',
        marginLeft: `${hierarchy*10}px`,
        marginBottom: '5px',
    };
    function setValue(id: number, key, value) {

    }
    return (
        <div
        style={style}
        >
            <img src={level.logo} alt='Não carregou!' />
            <h2>{level.title}</h2>

            <br />
            <label htmlFor="">Título</label>
            <input type="text" />

            <br/>
            <label htmlFor="">Tipo</label>
            <select value={level.type}>
                <option value={'artist'}>Artista</option>
                <option value={'album'}>Álbum</option>
            </select>

            <br />
            <label htmlFor="">Logo</label>
            <input type="text" />

            <br />
            <label htmlFor="">URL</label>
            <input type="text" />
        </div>
    );
}