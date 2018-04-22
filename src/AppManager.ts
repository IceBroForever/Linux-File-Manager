import { app, ipcMain } from "electron"
import MainWindow from "./MainWindow"
import FileSystem from "./FileSystem"
import { MainWindowSignals } from "./common/MainWindowConnection"

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

    public static getInstance(): App {
        if (!this.instance) this.instance = new App()
        return this.instance
    }

    public openNewMainWindow(pathToLoad: string = FileSystem.getCurrentUserHomeFolder()): void {
        if (!app.isReady()) {
            setTimeout(() => { this.openNewMainWindow(pathToLoad) }, 100);
            return;
        }

        let window: MainWindow = new MainWindow(pathToLoad);
        this.mainWindowDictionary[window.getId()] = window;
    }

    public getMainWindowById(id: number): MainWindow {
        return this.mainWindowDictionary[id]
    }

    public removeReferenceToMainWindowById(id: number): void {
        delete this.mainWindowDictionary[id]
    }
}

export default App.getInstance();