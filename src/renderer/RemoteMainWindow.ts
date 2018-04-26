import { ipcRenderer } from "electron"
import { MainWindowSignals } from "../common/MainWindowConnection"
import IMainWindow from "../common/IMainWindow"

class RemoteMainWindow implements IMainWindow {
    private static instance: RemoteMainWindow

    private constructor() { }

    public static getInstance(): RemoteMainWindow {
        if (!this.instance) this.instance = new RemoteMainWindow();
        return this.instance;
    }

    public close(): void {
        ipcRenderer.send(MainWindowSignals.CLOSE);
    }

    public minimize(): void {
        ipcRenderer.send(MainWindowSignals.MINIMIZE);
    }

    public changeFullscreenMode(): void{
        ipcRenderer.send(MainWindowSignals.CHANGE_FULLSCREEN_MODE);
    }
}

export default RemoteMainWindow.getInstance()