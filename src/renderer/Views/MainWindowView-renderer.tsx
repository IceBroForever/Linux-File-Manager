import React from "react"
import ReactDOM from "react-dom"
import MainWindowView from "./MainWindowView"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import createMuiTheme from "material-ui/styles/createMuiTheme"
import RemoteFileSystem from "../RemoteFileSystem/RemoteFileSystem"

const theme = createMuiTheme()

RemoteFileSystem.getCurrentUserHomeFolder()
.then(path => {
    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <MainWindowView pathToLoad={path} />
        </MuiThemeProvider>,
        document.getElementById('root')
    )
})