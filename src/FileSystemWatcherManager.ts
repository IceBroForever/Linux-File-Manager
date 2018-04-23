import FileSystemWatcher from "./FileSystemWatcher"

type FileSystemWatchersDictionary = {
    [path: string]: FileSystemWatcher
}

export default class FileSystemWatcherManager {
    dictionary: FileSystemWatchersDictionary;
    id: number

    constructor() {
        this.dictionary = {};
        this.id = 0;
    }

    setListener(path: string, onChange: (id: number) => void): number {
        const watcher = this.getWatcher(path);
        const id = this.id++;
        watcher.setListener(id, onChange);
        return id;
    }

    removeListener(id: number): void {
        for(let path in this.dictionary){
            let removed = this.dictionary[path].removeListener(id)
            if(removed && this.dictionary[path].removable) {
                this.dictionary[path].close();
                delete this.dictionary[path]
                return
            }
        }
    }

    private getWatcher(path: string): FileSystemWatcher {
        if(!(path in this.dictionary)) this.dictionary[path] = new FileSystemWatcher(path);
        return this.dictionary[path];
    }
}