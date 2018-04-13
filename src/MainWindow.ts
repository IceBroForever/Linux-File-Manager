import Window from "./Window"
import { BrowserWindowConstructorOptions } from "electron"
import url from "url"
import path from "path"

export default class MainWindow extends Window {
    constructor() {
        const options : BrowserWindowConstructorOptions = {
            width: 800,
            height: 450,
            minWidth: 350,
            minHeight: 250,
            frame: false
        }

        super(options)

        this.window.loadURL(url.format({
            pathname: path.resolve(__dirname, "views/MainWindowView/index.html"),
            protocol: 'file:',
            slashes: true
        }))
    }
}