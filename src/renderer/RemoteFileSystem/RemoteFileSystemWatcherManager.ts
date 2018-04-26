import { ipcRenderer } from "electron"
import RemoteFileSystemWatcher from "./RemoteFileSystemWatcher"
import { Listener, FileSystemSignals } from "../../common/FileSystemConnection"

type WatcherDictionary = {
    [path: string]: RemoteFileSystemWatcher
}

export default class RemoteFileSystemWatcherManager {
    private watcherDictionary: WatcherDictionary;
    private id: number;

    constructor() {
        this.watcherDictionary = {}
        this.id = 0;

        ipcRenderer.on(FileSystemSignals.LISTENER, (event, listener: Listener) => {
            for(let path in this.watcherDictionary){
                if(this.watcherDictionary[path].realId == listener.id){
                    this.watcherDictionary[path].emit();
                }
                return;
            }
        })
    }

    isContainWatcher(path: string): boolean {
        return path in this.watcherDictionary;
    }

    createWatcher(path: string, realId: number): RemoteFileSystemWatcher {
        this.watcherDictionary[path] = new RemoteFileSystemWatcher(realId);
        return this.watcherDictionary[path];
    }

    setListener(path: string, onChange: (id: number) => void): number {
        const id = this.id++;
        this.watcherDictionary[path].setListener(id, onChange);
        return id;
    }

    removeListener(id: number): number {
        for (let path in this.watcherDictionary) {
            let removed = this.watcherDictionary[path].removeListener(id);
            if (removed && this.watcherDictionary[path].removable()) {
                let id = this.watcherDictionary[path].realId;
                delete this.watcherDictionary[path];
                return id;
            }
        }
    }
}