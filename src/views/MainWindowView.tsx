import * as React from "react";
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import withStyles from "material-ui/styles/withStyles"
import { WithStyles } from "material-ui/styles/withStyles"

const style = theme => ({
    appbar: {
        "-webkit-app-region": "drag"
    }
})

type ComponentProps = Object
type WithStyleComponentProps = ComponentProps & WithStyles<'appbar'>

class MainWindowView extends React.Component<WithStyleComponentProps, {}> {
    render() {
        const { classes } = this.props

        return (
            <AppBar className={classes.appbar}>
                <Toolbar>
                    <h1> Hi there</h1>
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(style)<ComponentProps>(MainWindowView)