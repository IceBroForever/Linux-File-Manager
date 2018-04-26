import fs from "fs"
import os from "os"
import pth from "path"
import { ipcMain, app } from "electron"
import IFileSystem from "../../common/IFileSystem"
import { FileDescription, FolderDescription, Description } from "../../common/Descriptions"
import {
    FileSystemSignals, GetContentArgv,
    CreateFolderArgv, RemoveFolderArgv,
    CreateFileArgv, RemoveFileArgv,
    RenameArgv, WrappedArgv,
    Argv, Answer, SetListenerArgv, RemoveListenerArgv, Listener
} from "../../common/FileSystemConnection"
import AppManager from "../AppManager"
import FileSystemWatcherManager from "./FileSystemWatcherManager"

class FileSystem implements IFileSystem {
    private static instance: FileSystem;

    private watcherManager: FileSystemWatcherManager;

    private constructor() {
        this.watcherManager = new FileSystemWatcherManager();

        const handleReq = async (event, id: number, signal: FileSystemSignals, func) => {
            let answer: Answer
            try {
                let value = await func();
                answer = {
                    id,
                    error: null,
                    value
                }
            } catch (error) {
                answer = {
                    id,
                    error: error.message,
                    value: null
                }
            } finally {
                event.sender.send(signal, answer);
            }
        }

        const broadcast = (signal: FileSystemSignals, argv: Listener) => {
            AppManager.sendToAllMainWindows(signal, argv);
        }

        ipcMain.on(FileSystemSignals.GET_CONTENT, async (event, req: WrappedArgv) => {
            const { id } = req;
            const argv = req.argv as GetContentArgv
            handleReq(event, id, FileSystemSignals.GET_CONTENT, async () => {
                return this.getContent(argv.path)
            })
        })

        ipcMain.on(FileSystemSignals.CURRENT_USER_HOME_FOLDER, (event, req: WrappedArgv) => {
            const { id } = req;
            handleReq(event, id, FileSystemSignals.CURRENT_USER_HOME_FOLDER, async () => {
                return this.getCurrentUserHomeFolder()
            })
        })

        ipcMain.on(FileSystemSignals.CREATE_FOLDER, async (event, req: WrappedArgv) => {
            const { id } = req;
            const argv = req.argv as CreateFolderArgv
            handleReq(event, id, FileSystemSignals.CREATE_FOLDER, async () => {
                return this.createFolder(argv.path, argv.name)
            })
        })

        ipcMain.on(FileSystemSignals.REMOVE_FOLDER, async (event, req: WrappedArgv) => {
            const { id } = req;
            const argv = req.argv as RemoveFolderArgv
            handleReq(event, id, FileSystemSignals.REMOVE_FOLDER, async () => {
                return this.removeFolder(argv.dir)
            })
        })

        ipcMain.on(FileSystemSignals.CREATE_FILE, async (event, req: WrappedArgv) => {
            const { id } = req;
            const argv = req.argv as CreateFileArgv;
            handleReq(event, id, FileSystemSignals.CREATE_FILE, async () => {
                return this.createFile(argv.path, argv.name, argv.ext);
            })
        })

        ipcMain.on(FileSystemSignals.REMOVE_FILE, async (event, req: WrappedArgv) => {
            const { id } = req;
            const argv = req.argv as RemoveFileArgv
            handleReq(event, id, FileSystemSignals.REMOVE_FILE, async () => {
                return this.removeFile(argv.file)
            })
        })

        ipcMain.on(FileSystemSignals.RENAME, async (event, req: WrappedArgv) => {
            const { id } = req;
            const argv = req.argv as RenameArgv
            handleReq(event, id, FileSystemSignals.RENAME, async () => {
                return this.rename(argv.desc, argv.newName)
            })
        })

        ipcMain.on(FileSystemSignals.SET_LISTENER, async (event, req: WrappedArgv) => {
            const { id } = req;
            const argv = req.argv as SetListenerArgv;
            handleReq(event, id, FileSystemSignals.SET_LISTENER, async () => {
                return this.setListenerForChanges(argv.path, (idOfListener: number) => {
                    broadcast(FileSystemSignals.LISTENER, { id: idOfListener })
                });
            })
        })

        ipcMain.on(FileSystemSignals.REMOVE_LISTENER, async (event, req: WrappedArgv) => {
            const { id } = req;
            const argv = req.argv as RemoveListenerArgv;
            handleReq(event, id, FileSystemSignals.REMOVE_LISTENER, async () => {
                return this.removeListenerForChanges(argv.id);
            })
        })
    }

    public static getInstance(): FileSystem {
        if (!this.instance) this.instance = new FileSystem();
        return this.instance;
    }

    async getCurrentUserHomeFolder(): Promise<string> {
        return os.homedir();
    }

    private generateDescription(path: string, fullName: string, stats: fs.Stats): Description {
        if (stats.isDirectory()) {
            return {
                name: fullName,
                path: pth.join(path, fullName),
                created: stats.ctimeMs,
                modified: stats.ctimeMs,
                size: stats.size
            }
        }
        let dotExt = pth.extname(fullName);
        return {
            name: dotExt.length > 0 ? fullName.slice(0, -dotExt.length) : fullName,
            ext: dotExt.slice(1),
            path: pth.join(path, fullName),
            created: stats.ctimeMs,
            modified: stats.ctimeMs,
            size: stats.size
        }
    }

    async getStats(path: string, name: string): Promise<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => {
            fs.stat(pth.join(path, name), (error, stats) => {
                if (error) reject(error);
                resolve(stats);
            })
        })
    }

    async getContent(path: string): Promise<Description[]> {
        return new Promise<Description[]>((resolve, reject) => {
            fs.readdir(path, async (error, files) => {
                if (error) reject(error);
                let statsPromises: Promise<fs.Stats>[] = files.map(file => {
                    return this.getStats(path, file);
                });
                let stats = await Promise.all(statsPromises);
                let descriptions = stats.map((stats, i) => {
                    return this.generateDescription(path, files[i], stats);
                })
                resolve(descriptions);
            });
        })
    }

    async createFolder(path: string, name: string): Promise<{}> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (error, existNames) => {
                let newName: string;
                main: for (let i = 0; ; i++) {
                    newName = i == 0 ? name : `${name}(${i})`;
                    for (let existName of existNames) {
                        if (existName == newName) continue main;
                    }
                    break main;
                }
                fs.mkdir(pth.join(path, newName), error => {
                    if (error) reject(error);
                    resolve();
                })
            })
        });
    }

    async removeFolder(dir: FolderDescription): Promise<{}> {
        return new Promise((resolve, reject) => {
            fs.rmdir(dir.path, error => {
                if (error) reject(error);
                resolve();
            });
        });
    }

    async createFile(path: string, name: string, ext: string): Promise<{}> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (error, existNames) => {
                if (error) reject(error);
                let filename;
                main: for (let i = 0; ; i++) {
                    filename = i == 0 ? name : `${name}(${i}).${ext}`
                    for (let existName of existNames) {
                        if (filename == existName) continue main;
                    }
                    break main;
                }
                fs.writeFile(pth.join(path, filename), "", error => {
                    if (error) reject(error);
                    resolve();
                })
            });
        });
    }

    async removeFile(file: FileDescription): Promise<{}> {
        return new Promise((resolve, reject) => {
            fs.unlink(file.path, error => {
                if (error) reject(error);
                resolve()
            })
        })
    }

    async rename(desc: Description, newName: string): Promise<{}> {
        return new Promise((resolve, reject) => {
            let path = desc.path.slice(0, desc.path.lastIndexOf('/'));
            let newPath = pth.join(path, newName);
            fs.readdir(path, (error, existNames) => {
                if (error) reject(error);
                for (let existName of existNames) {
                    if (existName == newName) reject(new Error(`${newName} already exists`))
                }
                fs.rename(desc.path, newPath, error => {
                    if (error) reject(error);
                    resolve();
                })
            })
        });
    }

    async setListenerForChanges(path: string, onChange: (id: number) => void): Promise<number> {
        return this.watcherManager.setListener(path, onChange);
    }

    async removeListenerForChanges(id: number): Promise<{}> {
        this.watcherManager.removeListener(id);
        return;
    }
}

export default FileSystem.getInstance()