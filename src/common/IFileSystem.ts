export default interface IFileSystem {
    getCurrentUserHomeDirection() : string;
    createDirection(path: string, name: string);
    renameDirection(path: string, newName: string);
    removeDirection(path: string);
    createFile(path: string, name: string);
    renameFile(path: string, newName: string);
    removeFile(path: string)
}