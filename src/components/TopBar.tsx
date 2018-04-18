import * as React from "react";
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import withStyles from "material-ui/styles/withStyles"
import { WithStyles } from "material-ui/styles/withStyles"
import WindowButtons from "./WindowButtons"

const style = theme => ({
    appbar: {
        "-webkit-app-region": "drag"
    },
    toolbar: {
        display: 'flex',
        'align-content': 'center'
    },
    empty: {
        flex: 1
    }
})

type ComponentProps = Object
type ComponentPropsWithStyle = ComponentProps & WithStyles<'appbar' | 'toolbar' | 'empty'>

class TopBar extends React.Component<ComponentPropsWithStyle>{
    render(){
        const {classes} = this.props;

        return (
            <AppBar className={classes.appbar}>
                <Toolbar className={classes.toolbar}>
                    <div className={classes.empty} />
                    <WindowButtons />
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(style)<ComponentProps>(TopBar);