import React, { createContext, useContext, useEffect, useState } from "react";
import type { Jellyconf } from "../../types/jellyconf";
import Directory from "./features/Directory";

export const Context = createContext<{jellyconf: Jellyconf, setJellyconf: React.Dispatch<React.SetStateAction<Jellyconf>>}>({
    jellyconf: [],
    setJellyconf: () => {}
});

export function ContextProvider({ children }) {
    const [jellyconf, setJellyconf] = useState<Jellyconf>([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    const value = { jellyconf, setJellyconf };

    useEffect(() => {
        if (!dataIsLoaded) {
            fetch("/api/jellyconf", {
                method: "GET"
            })
            .then((res) => res.json())
            .then((json) => {
                setJellyconf(json);
                console.log(jellyconf);
                setDataIsLoaded(true);
            })
        }
    }, []);

    // if (!dataIsLoaded) {
    //     return (
    //         <>
    //             Aguarde...
    //         </>
    //     )
    // }

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
}

export function Body() {
    const {jellyconf, setJellyconf} = useContext(Context);

    if (!jellyconf) {
        return (
            <div>Carregando...</div>
        );
    }
    return (
        <ContextProvider>
            <div style={{
                position: 'absolute',
                top: '50px',
                bottom: 0,
                width: '100vw',
                maxWidth: '100vw',
                overflowX: 'hidden',
                overflowY: 'scroll',
                scrollbarWidth: 'none',
                padding: '10px'
            }}>
                <Directory/>
            </div>
        </ContextProvider>
    );
}