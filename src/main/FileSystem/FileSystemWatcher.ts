import fs from "fs"

type CallbackDictionary = {
    [id: number]: (id: number) => void;
}

export default class FileSystemWatcher {
    private watcher: fs.FSWatcher;
    private callbackDictionary: CallbackDictionary;
    private timeOfLastEvent: number

    constructor(path: string) {
        this.callbackDictionary = {};
        this.timeOfLastEvent = Date.now() - 100
        this.watcher = fs.watch(path, (eventType, filename) => {
            this.handleEvent(eventType, filename);
        });
    }

    setListener(id: number, onChange: (id: number) => void){
        this.callbackDictionary[id] = onChange;
    }

    removeListener(id: number) : boolean{
        if(id in this.callbackDictionary){
            delete this.callbackDictionary[id];
            return true;
        }
        return false;
    }

    close(): void{
        this.watcher.close();
        this.watcher = null;
    }

    removable() : boolean{
        for(let id in this.callbackDictionary){
            return false;
        }
        return true;
    }

    private handleEvent(eventType: string, filename: string): void {
        if (eventType == "change") return;
        let timeOfNewEvent = Date.now();
        if (timeOfNewEvent - this.timeOfLastEvent < 100) return;
        this.timeOfLastEvent = timeOfNewEvent;
        this.emitChanges();
    }

    private emitChanges(): void {
        let promises: Promise<{}>[] = [];
        for (let callbackId in this.callbackDictionary) {
            promises.push(new Promise<{}>((resolve, reject) => {
                this.callbackDictionary[callbackId](parseInt(callbackId));
                resolve();
            }))
        }
        Promise.all(promises);
    }
}