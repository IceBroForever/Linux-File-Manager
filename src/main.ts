import { app } from "electron"
import MainWindow from "./MainWindow"

app.on("ready", () => {
    new MainWindow()
})

app.on('window-all-closed', () => {
    app.quit()
})