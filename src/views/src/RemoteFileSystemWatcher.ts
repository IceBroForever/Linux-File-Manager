type CallbackDictionary = {
    [id: number]: (id: number) => void
}

export default class RemoteFileSystemWatcher {
    private dictionary: CallbackDictionary;
    readonly realId: number

    constructor(realId: number) {
        this.realId = realId;
        this.dictionary = {}
    }

    setListener(id: number, onChange: (id: number) => void) {
        this.dictionary[id] = onChange;
    }

    removeListener(id: number): boolean {
        if (!(id in this.dictionary)) return false;
        delete this.dictionary[id];
        return true;
    }

    removable(): boolean {
        for (let id in this.dictionary) return false;
        return true;
    }

    emit(): void{
        let promises: Promise<{}>[] = [];
        for (let id in this.dictionary) {
            promises.push(new Promise<{}>((resolve, reject) => {
                this.dictionary[id](parseInt(id));
                resolve();
            }))
        }
        Promise.all(promises);
    }
}