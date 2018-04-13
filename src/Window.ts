import { BrowserWindow, BrowserWindowConstructorOptions } from "electron"

export default class Window {
    protected window: BrowserWindow | null

    constructor(options : BrowserWindowConstructorOptions | undefined) {
        this.window = new BrowserWindow(options)

        this.window.once('ready-to-show', () => {
            this.window.show()
        })

        this.window.once('closed', () => {
            this.window = null
        })
    }
}