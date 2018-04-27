import { app, ipcMain } from "electron"
import MainWindow from "./MainWindow"
import FileSystem from "../FileSystem/FileSystem"
import { MainWindowSignals } from "../../common/MainWindowConnection"

interface MainWindowsDictionary {
    [id: number]: MainWindow
}

class App {
    private static instance: App;

    private mainWindowDictionary: MainWindowsDictionary = {} as MainWindowsDictionary;

    private constructor() {
        app.on('window-all-closed', () => {
            app.quit()
        })

        ipcMain.on(MainWindowSignals.CLOSE, (event) => {
            let window : MainWindow = this.mainWindowDictionary[event.sender.id];
            window.close()
        });

        ipcMain.on(MainWindowSignals.CHANGE_FULLSCREEN_MODE, (event) => {
            let window : MainWindow = this.mainWindowDictionary[event.sender.id];
            window.changeFullscreenMode()
        });

        ipcMain.on(MainWindowSignals.MINIMIZE, (event) => {
            let window : MainWindow = this.mainWindowDictionary[event.sender.id];
            window.minimize()
        });
    }

    static getInstance(): App {
        if (!this.instance) this.instance = new App()
        return this.instance
    }

    openNewMainWindow(pathToLoad: string = undefined): void {
        const f = async () => {
            if(!pathToLoad) pathToLoad = await FileSystem.getCurrentUserHomeFolder();

            if (!app.isReady()) {
                setTimeout(() => { this.openNewMainWindow(pathToLoad) }, 100);
                return;
            }
    
            let window: MainWindow = new MainWindow(pathToLoad);
            this.mainWindowDictionary[window.getId()] = window;
        }
        f();
    }

    getMainWindowById(id: number): MainWindow {
        return this.mainWindowDictionary[id]
    }

    removeReferenceToMainWindowById(id: number): void {
        delete this.mainWindowDictionary[id]
    }

    sendToAllMainWindows(signal, argv): void{
        for(let id in this.mainWindowDictionary){
            this.mainWindowDictionary[id].send(signal, argv);
        }
    }
}

export default App.getInstance();