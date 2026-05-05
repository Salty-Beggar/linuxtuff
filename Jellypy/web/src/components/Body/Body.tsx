import { useEffect, useState, type CSSProperties, type ReactElement } from "react";
import './Body.scss'

export function Body() {
    const [jellyconf, setJellyconf]: any = useState([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    if (!dataIsLoaded) {
        fetch("/api/jellyconf", {
            method: "GET"
        })
        .then((res) => res.json())
        .then((json) => {
            setJellyconf(json);
            setDataIsLoaded(true);
        })
    }

    if (!dataIsLoaded) {
        return (
            <>
                Aguarde...
            </>
        )
    }

    return (
        <>
            <div style={{
                position: 'absolute',
                top: '50px',
                bottom: 0,
                maxWidth: '100vw',
                overflowX: 'hidden',
                overflowY: 'scroll',
                scrollbarWidth: 'none',
                padding: '10px'
            }}>
                <FolderList jellyconf={jellyconf} />
            </div>
        </>
    );
}

function FolderList(props: {jellyconf}) {

    let curHierarchy = 0;
    function generateFolders(folder: any) {
        const markup = (
            <>
                <Folder
                    title={folder.title}
                    img={folder.logo}
                    url={folder.url}
                    hierarchy={curHierarchy}
                    isAddition={false}
                />
            </>
        );
        curHierarchy++;
        const subMarkup: ReactElement[] = folder.items.map(generateFolders);
        // for (const key in folder.items) {
        //     subMarkup.push();
        // }

        curHierarchy--;
        return (<>
            {markup}
            <FolderAdd hierarchy={curHierarchy+1}/>
            {subMarkup.map(a => a)}
        </>);
    }

    const style: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    };
    const containerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        textAlign: 'center'
    }
    return (
        <>
            <div style={containerStyle}>
                <FolderSubmit />
                <h1>Configuração atual</h1>
                <ul style={style}>
                    {props.jellyconf.map(generateFolders)}
                </ul>
            </div>
        </>
    );
}

function Folder(props: {title: string, img: string, url: string, hierarchy: number, isAddition: boolean}) {
    const [title, setTitle] = useState(props.title);
    const [img, setImg] = useState(props.img);
    const [url, setUrl] = useState(props.url);
    const style: CSSProperties = {
        marginLeft: `${props.hierarchy*30}px`,
        borderRadius: 10,
        backgroundColor: "black",
        color: 'white',
        display: 'flex',
        gap: 10,
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
    return (
        <>
            <li style={style}>
                <h1 style={titleStyle}>{title}
                    <img src={img} alt={title} style={imgStyle} />
                </h1>
                {/* <div>URL da imagem: <br/>{props.img}</div>
                <div>URL da playlist: <br/> {props.url}</div> */}
                <FolderField name={'URL da imagem:'} initialValue={img} editable={true} formInfo={
                    {
                        type: 'text'
                    }
                } 
                onEdit={(newValue) => { setImg(newValue) }}
                />
                <FolderField name={'URL da playlist:'} initialValue={url} editable={true} formInfo={
                    {
                        type: 'text'
                    }
                }
                onEdit={(newValue) => { setUrl(newValue) }}
                />
            </li>
        </>
    );
}

function FolderAdd(props: {hierarchy: number}) {
    const style: CSSProperties = {
        marginLeft: `${props.hierarchy*30}px`,
        borderRadius: '5px',
        backgroundColor: 'green'
    }
    return (
        <>
            <button style={style}>
                Adicionar pasta
            </button>
        </>
    );
}

function FolderSubmit() {
    const style: CSSProperties = {
        borderRadius: '5px',
        backgroundColor: 'orange',
        width: '100%'
    }
    return (
        <>
            <button style={style}>
                Propor adições
            </button>
        </>
    );
}

type FormInfo = {
    type: 'select'|'text',
    selectOptions?: {name:string, value: string}[]
}

let folderIndex = 0;
function FolderField(props: {name: string, initialValue: string, editable: boolean, formInfo: FormInfo, onEdit: (newValue: string) => void}) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(props.initialValue);

    const labelMarkup = (
        <>
            <label>{props.name}</label>
        </>
    );
    let textMarkup = (
        <>
            <p>
                {props.initialValue}
            </p>
        </>
    );
    let editButtonMarkup = (<></>)
    if (props.editable) {
        function startEdit() {
            setIsEditing(true)

        }
        const buttonStyle: CSSProperties = {
            backgroundColor: 'orange',
            textAlign: 'center',
            borderRadius: '4px',
            height: '25px',
            width: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
        editButtonMarkup = (<>
            <button style={buttonStyle} onClick={startEdit}>
                <i className="fa-solid fa-pen-to-square"></i>
            </button>
        </>);
    }
    let curInputID: string;
    if (isEditing) {
        curInputID = `Input_${folderIndex++}_${props.name}`;
        function stopEdit() {
            // setValue(document.getElementById(curInputID).value)
            // @ts-ignore
            const inputDiv: HTMLInputElement = document.getElementById(curInputID);
            console.log(inputDiv);
            setValue(inputDiv.value)
            setIsEditing(false)
            props.onEdit(inputDiv.value);
        }
        if (props.formInfo.type == 'text') {
            textMarkup = (
                <>
                    <input id={curInputID} onBlur={stopEdit} type='text' defaultValue={value} />
                </>
            );
        }else {
            textMarkup = (
                <>
                    <select>
                        {/* @ts-expect-error */}
                        {props.formInfo.selectOptions.map(
                            (a) => (<><option defaultValue={a.value}>{a.name}</option></>)
                        )}
                    </select>
                </>
            );
        }
    }
    useEffect(() => {
        if (isEditing) {
            // @ts-ignore
            const inputDiv: HTMLInputElement = document.getElementById(curInputID);
            inputDiv.focus();
        }
    });
    return (
        <>
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    {labelMarkup}
                    {editButtonMarkup}
                </div>
                {textMarkup}
            </div>
        </>
    );
}