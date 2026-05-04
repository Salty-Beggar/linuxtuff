import { useEffect, useState, type CSSProperties, type StyleHTMLAttributes } from "react";


export function Header() {

    const style: CSSProperties = {
        height: '50px',
        backgroundColor: "black",
        color: 'white',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
    return (
        <>
            <div style={style}>
                Jellypy
            </div>
        </>
    );
}