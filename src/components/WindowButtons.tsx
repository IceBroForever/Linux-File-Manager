import * as React from "react";
import RemoteMainWindow from "../views/src/RemoteMainWindow"
import IconButton from "material-ui/IconButton"
import MinimizeIcon from "@material-ui/icons/Remove"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import CloseIcon from "@material-ui/icons/Cancel"
import withStyles from "material-ui/styles/withStyles"
import { WithStyles } from "material-ui/styles/withStyles"
import createMuiTheme from "material-ui/styles/createMuiTheme"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import withTheme from "material-ui/styles/withTheme"
import { WithTheme } from "material-ui/styles/withTheme"
import red from "material-ui/colors/red"

const style = () => ({
    button: {
        "-webkit-app-region": "no-drag"
    }
})

const theme = createMuiTheme({
    palette: {
        primary: {
            main: red[600]
        },
        secondary: {
            main: "#ffffff"
        }
    }
})

type ComponentProps = Object
type ComponentPropsWithStyle = ComponentProps & WithStyles<'button'>
type ComponentPropsWithStyleAndTheme = ComponentPropsWithStyle & WithTheme

class WindowButtons extends React.Component<ComponentPropsWithStyleAndTheme>{
    render() {
        const { classes } = this.props

        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <IconButton color="secondary" className={classes.button} onClick={() => { RemoteMainWindow.minimize() }}>
                        <MinimizeIcon />
                    </IconButton>
                    <IconButton color="secondary" className={classes.button} onClick={() => { RemoteMainWindow.changeFullscreenMode() }}>
                        <FullscreenIcon />
                    </IconButton>
                    <IconButton color="primary" className={classes.button} onClick={() => { RemoteMainWindow.close() }}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(style)<ComponentProps>(withTheme()<ComponentPropsWithStyle>(WindowButtons));