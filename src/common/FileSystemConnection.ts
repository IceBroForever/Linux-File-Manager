import { FileDescription, FolderDescription, Description } from "./Descriptions"

export type GetContentArgv = {
    dir: FolderDescription
}

export type CreateFolderArgv = {
    path: string,
    name: string
}

export type RemoveFolderArgv = GetContentArgv

export type CreateFileArgv = {
    path: string,
    name: string,
    ext: string
}

export type RemoveFileArgv = {
    file: FileDescription
}

export type RenameArgv = {
    desc: Description,
    newName: string
}

export type Argv = GetContentArgv | CreateFolderArgv | RemoveFolderArgv | CreateFileArgv | RemoveFileArgv | RenameArgv | undefined

export type WrappedArgv = {
    id: number,
    argv: Argv
}

export type Answer = {
    id: number,
    error: undefined | string,
    value: any
}

export enum FileSystemSignals {
    CURRENT_USER_HOME_FOLDER = "CURRENT_USER_HOME_FOLDER",
    GET_CONTENT = "GET_CONTENT",
    CREATE_FOLDER = "CREATE_FOLDER",
    REMOVE_FOLDER = "REMOVE_FOLDER",
    CREATE_FILE = "CREATE_FILE",
    REMOVE_FILE = "REMOVE_FILE",
    RENAME = "RENAME"
}