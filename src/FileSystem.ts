import fs from "fs"
import os from "os"
import IFileSystem from "./common/IFileSystem"

class FileSystem implements IFileSystem {
    private static instance: FileSystem;

    private constructor() { }

    public static getInstance(): FileSystem {
        if (!this.instance) this.instance = new FileSystem();
        return this.instance;
    }

    getCurrentUserHomeDirection(): string {
        return os.homedir();
    }

    createDirection(path: string, name: string){
        throw new Error("Not implemented")
    }
    
    renameDirection(path: string, newName: string){
        throw new Error("Not implemented")
    }
    
    removeDirection(path: string){
        throw new Error("Not implemented")
    }
    
    createFile(path: string, name: string){
        throw new Error("Not implemented")
    }
    
    renameFile(path: string, newName: string){
        throw new Error("Not implemented")
    }
    
    removeFile(path: string){
        throw new Error("Not implemented")
    }
    
}

export default FileSystem.getInstance()