import { ipcRenderer } from "electron"
import {
    FileSystemSignals, GetContentArgv,
    CreateFolderArgv, RemoveFolderArgv,
    CreateFileArgv, RemoveFileArgv,
    RenameArgv, WrappedArgv,
    Argv, Answer
} from "../../common/FileSystemConnection"
import { FileDescription, FolderDescription, Description } from "../../common/Descriptions"
import IFileSystem from "../../common/IFileSystem"

class RemoteFileSystem implements IFileSystem {
    private static instance: RemoteFileSystem;
    private id: number = 0;

    private constructor() { }

    static getInstance(): RemoteFileSystem {
        if (this.instance == null) this.instance = new RemoteFileSystem();
        return this.instance;
    }

    async wrapSignal(signal: FileSystemSignals, argv: Argv): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const id = this.id++;
            const handler = (event, answer: Answer) => {
                if (answer.id != id) {
                    ipcRenderer.once(signal, handler)
                    return;
                }
                if (answer.error) reject(answer.error);
                resolve(answer.value);
            }
            ipcRenderer.once(signal, handler)
        })
    }

    async getContent(dir: FolderDescription): Promise<Description[]> {
        try {
            let argv: GetContentArgv = {
                dir
            }
            let value = await this.wrapSignal(FileSystemSignals.GET_CONTENT, argv)
            return value as Description[];
        } catch (error) {
            throw error
        }
    }

    async getCurrentUserHomeFolder(): Promise<string> {
        try {
            let argv;
            let value = await this.wrapSignal(FileSystemSignals.CURRENT_USER_HOME_FOLDER, argv)
            return value as string;
        } catch (error) {
            throw error
        }
    }

    async createFolder(path: string, name: string): Promise<{}> {
        try {
            let argv: CreateFolderArgv = {
                path,
                name
            }
            let value = await this.wrapSignal(FileSystemSignals.CREATE_FOLDER, argv)
            return value;
        } catch (error) {
            throw error
        }
    }

    async removeFolder(dir: FolderDescription): Promise<{}> {
        try {
            let argv: RemoveFolderArgv = {
                dir
            }
            let value = await this.wrapSignal(FileSystemSignals.REMOVE_FOLDER, argv)
            return value;
        } catch (error) {
            throw error
        }
    }

    async createFile(path: string, name: string, ext: string): Promise<{}> {
        try {
            let argv: CreateFileArgv = {
                path,
                name,
                ext
            }
            let value = await this.wrapSignal(FileSystemSignals.CREATE_FILE, argv)
            return value;
        } catch (error) {
            throw error
        }
    }

    async removeFile(file: FileDescription): Promise<{}> {
        try {
            let argv: RemoveFileArgv = {
                file
            }
            let value = await this.wrapSignal(FileSystemSignals.REMOVE_FILE, argv)
            return value as Description[];
        } catch (error) {
            throw error
        }
    }

    async rename(desc: Description, newName: string): Promise<{}> {
        try {
            let argv: RenameArgv = {
                desc,
                newName
            }
            let value = await this.wrapSignal(FileSystemSignals.RENAME, argv)
            return value;
        } catch (error) {
            throw error
        }
    }
}

export default RemoteFileSystem.getInstance();