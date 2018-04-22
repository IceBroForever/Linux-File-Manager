import { Description, FolderDescription, FileDescription } from "./Descriptions"

export default interface IFileSystem {
    getContent(dir: FolderDescription);
    getCurrentUserHomeFolder();
    createFolder(path: string, name: string);
    removeFolder(dir: FolderDescription);
    createFile(path: string, name: string, ext: string);
    removeFile(file: FileDescription);
    rename(desc: Description, newName: string);
}