export type FileDescription = {
    name : string,
    ext: string,
    path: string
    created: number,
    modified: number,
    size: number
}

export type FolderDescription = {
    name : string,
    path: string,
    created: number,
    modified: number,
    size: number
}

export type Description = FileDescription | FolderDescription