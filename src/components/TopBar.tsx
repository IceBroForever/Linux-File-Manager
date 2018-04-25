import * as React from "react";
import AppBar from "material-ui/AppBar"
import Toolbar from "material-ui/Toolbar"
import withStyles, { WithStyles } from "material-ui/styles/withStyles"
import WindowButtons from "./WindowButtons"
import NavigationButtons from "./NavigationButtons"

const style = theme => ({
    "appbar-container": {
        ...theme.mixins.toolbar,
        "z-index": 1000
    },
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

type ComponentProps = {
    onChangePath: (path: string) => void,
    path: string
}
type ComponentPropsWithStyle = ComponentProps & WithStyles<'appbar' | 'toolbar' | 'empty' | 'appbar-container'>

class TopBar extends React.Component<ComponentPropsWithStyle>{
    render() {
        const { classes } = this.props;

        return (
            <div className={classes["appbar-container"]}>
                <AppBar className={classes.appbar} position={"static"}>
                    <Toolbar className={classes.toolbar}>
                        <NavigationButtons onChangePath={this.props.onChangePath} path={this.props.path} />
                        <div className={classes.empty} />
                        <WindowButtons />
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(style)<ComponentProps>(TopBar);