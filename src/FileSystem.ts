import fs from "fs"
import os from "os"
import pth from "path"
import IFileSystem from "./common/IFileSystem"
import { FileDescription, FolderDescription, Description } from "./common/Descriptions"
import { resolve } from "url";

class FileSystem implements IFileSystem {
    private static instance: FileSystem;

    private constructor() { }

    public static getInstance(): FileSystem {
        if (!this.instance) this.instance = new FileSystem();
        return this.instance;
    }

    getCurrentUserHomeFolder(): string {
        return os.homedir();
    }

    private generateDescription(dir: FolderDescription, fullName: string, stats: fs.Stats): Description {
        if (stats.isDirectory()) {
            return {
                name: fullName,
                path: pth.join(dir.path, fullName),
                created: stats.ctimeMs,
                modified: stats.ctimeMs,
                size: stats.size
            }
        }
        let dotExt = pth.extname(fullName);
        return {
            name: fullName.slice(0, -dotExt.length),
            ext: dotExt.slice(1),
            path: pth.join(dir.path, fullName),
            created: stats.ctimeMs,
            modified: stats.ctimeMs,
            size: stats.size
        }
    }

    async getStats(dir: FolderDescription, name: string): Promise<fs.Stats>{
        return new Promise<fs.Stats>((resolve, reject) => {
            fs.stat(pth.join(dir.path, name), (error, stats) => {
                if(error) reject(error);
                resolve(stats);
            })
        })
    }

    async getContent(dir: FolderDescription): Promise<Description[]> {
        return new Promise<Description[]>((resolve, reject) => {
            fs.readdir(dir.path, async (error, files) => {
                if(error) reject(error);
                let statsPromises: Promise<fs.Stats>[] = files.map(file => {
                    return this.getStats(dir, file);
                });
                let stats = await Promise.all(statsPromises);
                let descriptions = stats.map((stats, i) => {
                    return this.generateDescription(dir, files[i], stats);
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

    async createFile(path: string, name: string): Promise<{}> {
        return new Promise((resolve, reject) => {
            const fileDotExt = pth.extname(name),
                fileName = name.slice(0, name.lastIndexOf(fileDotExt));
            fs.readdir(path, (error, existNames) => {
                if (error) reject(error);
                main: for (let i = 0; ; i++) {
                    name = i == 0 ? name : `${fileName}(${i})${fileDotExt}`
                    for (let existName of existNames) {
                        if (name == existName) continue main;
                    }
                    break main;
                }
                fs.writeFile(pth.join(path, name), "", error => {
                    if (error) reject(error);
                    resolve();
                })
            });
        });
    }

    async removeFile(file: FileDescription): Promise<{}> {
        return new Promise((resolve, reject) => {
            fs.unlink(file.path, error => {
                if(error) reject(error);
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
}

export default FileSystem.getInstance()