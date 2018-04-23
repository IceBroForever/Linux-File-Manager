import { Description, FolderDescription, FileDescription } from "./Descriptions"

export default interface IFileSystem {
    getContent(dir: FolderDescription): Promise<Description[]>;
    getCurrentUserHomeFolder(): Promise<string>;
    createFolder(path: string, name: string): Promise<{}>;
    removeFolder(dir: FolderDescription): Promise<{}>;
    createFile(path: string, name: string, ext: string): Promise<{}>;
    removeFile(file: FileDescription): Promise<{}>;
    rename(desc: Description, newName: string): Promise<{}>;
    setListenerForChanges(path: string, onChange: (id: number) => {}): Promise<number>;
    removeListenerForChanges(id: number): Promise<{}>;
}