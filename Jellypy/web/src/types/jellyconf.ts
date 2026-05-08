
export type Jellyconf = Directory[]

export type Directory = {
    title: string,
    type: 'artist'|'album',
    downloaded: boolean,
    logo?: string,
    url?: string,
    items?: Directory[]
}