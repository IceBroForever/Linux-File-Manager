import * as React from "react";
import AppBar from "material-ui/AppBar"
import withStyles from "material-ui/styles/withStyles"
import { WithStyles } from "material-ui/styles/withStyles"

const style = () => ({
    appbar: {
        "-webkit-app-region": "drag"
    }
})

class MainWindowView extends React.Component<WithStyles<'appbar'>, {}> {
    render() {
        const { classes } = this.props

        return (
            <AppBar className={classes.appbar}>
                <h1> Hi there</h1>
            </AppBar>
        )
    }
}

export default withStyles(style)<{}>(MainWindowView)