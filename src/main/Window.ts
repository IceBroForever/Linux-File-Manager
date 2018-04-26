import { BrowserWindow, BrowserWindowConstructorOptions } from "electron"

export default abstract class Window {
    protected window: BrowserWindow
    protected id: number

    constructor(options : BrowserWindowConstructorOptions | undefined) {
        this.window = new BrowserWindow(options)
        this.id = this.window.webContents.id

        this.window.once('ready-to-show', () => {
            this.window.show()
        })
    }

    getId() : number {
        return this.id
    }

    abstract close() : void;
}