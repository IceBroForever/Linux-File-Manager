import { app } from "electron"
import MainWindow from "./MainWindow"
import FileSystem from "./FileSystem"

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
    }

    public static getInstance(): App {
        if (!this.instance) this.instance = new App()
        return this.instance
    }

    public openNewMainWindow(pathToLoad: string = FileSystem.getCurrentUserHomeDirection()): void {
        if (!app.isReady()) {
            setTimeout(() => { this.openNewMainWindow(pathToLoad) }, 100);
            return;
        }

        let window: MainWindow = new MainWindow(pathToLoad);
        this.mainWindowDictionary[window.id()] = window;
    }

    public getMainWindowById(id: number): MainWindow {
        return this.mainWindowDictionary[id]
    }

    public removeReferenceToMainWindowById(id: number): void {
        delete this.mainWindowDictionary[id]
    }
}

export default App.getInstance();