import url from "url"
import path from "path"
import { BrowserWindowConstructorOptions } from "electron"
import Window from "./Window"
import IMainWindow from "./common/IMainWindow"
import AppManager from "./AppManager"

export default class MainWindow extends Window implements IMainWindow {
    private pathToLoad : string;

    constructor(pathToLoad: string) {

        const options : BrowserWindowConstructorOptions = {
            width: 800,
            height: 450,
            minWidth: 350,
            minHeight: 250,
            frame: false
        }

        super(options)

        this.pathToLoad = pathToLoad

        this.window.loadURL(url.format({
            pathname: path.resolve(__dirname, "views/MainWindowView/index.html"),
            protocol: 'file:',
            slashes: true
        }))

        this.window.on("closed", () => {
            AppManager.removeReferenceToMainWindowById(this.id)
            this.window = null
        })
    }

    close() : void {
        this.window.close();
    }

    minimize() : void {
        this.window.minimize();
    }

    changeFullscreenMode() : void {
        let enabled = this.window.isFullScreen();
        this.window.setFullScreen(!enabled);
    }

    send(signal, argv): void {
        this.window.webContents.send(signal, argv);
    }
}