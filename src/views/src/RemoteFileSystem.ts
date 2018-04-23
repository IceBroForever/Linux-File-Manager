import { ipcRenderer } from "electron"
import {
    FileSystemSignals, GetContentArgv,
    CreateFolderArgv, RemoveFolderArgv,
    CreateFileArgv, RemoveFileArgv,
    RenameArgv, WrappedArgv,
    Argv, Answer, SetListenerArgv, RemoveListenerArgv
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

            const req: WrappedArgv = {
                id,
                argv
            }
            ipcRenderer.send(signal, req);
        })
    }

    async getContent(dir: FolderDescription): Promise<Description[]> {
        try {
            let argv: GetContentArgv = {
                dir
            }
            return await this.wrapSignal(FileSystemSignals.GET_CONTENT, argv) as Description[]
        } catch (error) {
            throw error
        }
    }

    async getCurrentUserHomeFolder(): Promise<string> {
        try {
            let argv;
            return await this.wrapSignal(FileSystemSignals.CURRENT_USER_HOME_FOLDER, argv) as string
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
            return await this.wrapSignal(FileSystemSignals.CREATE_FOLDER, argv)
        } catch (error) {
            throw error
        }
    }

    async removeFolder(dir: FolderDescription): Promise<{}> {
        try {
            let argv: RemoveFolderArgv = {
                dir
            }
            return await this.wrapSignal(FileSystemSignals.REMOVE_FOLDER, argv)
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
            return await this.wrapSignal(FileSystemSignals.CREATE_FILE, argv)
        } catch (error) {
            throw error
        }
    }

    async removeFile(file: FileDescription): Promise<{}> {
        try {
            let argv: RemoveFileArgv = {
                file
            }
            return await this.wrapSignal(FileSystemSignals.REMOVE_FILE, argv)
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
            return await this.wrapSignal(FileSystemSignals.RENAME, argv)
        } catch (error) {
            throw error
        }
    }

    async setListenerForChanges(path: string): Promise<number> {
        try {
            let argv: SetListenerArgv = {
                path
            }
            return await this.wrapSignal(FileSystemSignals.SET_LISTENER, argv) as number
        } catch (error) {
            throw error
        }
    }

    async removeListenerForChanges(id: number): Promise<{}>{
        try {
            let argv: RemoveListenerArgv = {
                id
            }
            return await this.wrapSignal(FileSystemSignals.REMOVE_LISTENER, argv)
        } catch (error) {
            throw error
        }
    }
}

export default RemoteFileSystem.getInstance();