import { app, BrowserWindow } from "electron"
import path from "path"
import url from "url"

let win;

app.on("ready", () => {
    win = new BrowserWindow({
        height: 600,
        width: 800
    })
    
    win.loadURL(url.format({
        pathname: path.resolve(__dirname, "views", "test", "index.html"),
        protocol: 'file:',
        slashes: true
    }))

    win.on('closed', () => {
        win = null
    })
})

app.on('window-all-closed', () => {
    app.quit()
})