import React from "react"
import ReactDOM from "react-dom"
import MainWindowView from "./MainWindowView"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import createMuiTheme from "material-ui/styles/createMuiTheme"

const theme = createMuiTheme()

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <MainWindowView />
    </MuiThemeProvider>,
    document.getElementById('root')
);