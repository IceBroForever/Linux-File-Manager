import * as React from "react";
import withStyles, { WithStyles } from "material-ui/styles/withStyles"
import TopBar from "../components/TopBar"
import DirectoryBrowser from "../components/DirectoryBrowser"
import DrawStrategy from "./src/DrawStrategy"

const style = theme => ({
    container: {
        width: '100%',
        height: '100%',
        position: 'relative' as 'relative',
        display: 'flex',
        flexDirection: "column" as 'column'
    },
    "flex-container": {
        flex: 1,
        display: "flex"
    }
})

type ComponentState = {
    drawStrategy: any,
    currentPath: string,
    showHidden: boolean
}

type ComponentProps = {
    pathToLoad: string
}
type WithStyleComponentProps = ComponentProps & WithStyles<"flex-container" | 'container'>

class MainWindowView extends React.Component<WithStyleComponentProps, ComponentState> {
    state = {
        drawStrategy: DrawStrategy.Icon,
        currentPath: this.props.pathToLoad,
        showHidden: false
    }

    changeCurrentPath(newPath: string) {
        this.setState({
            currentPath: newPath
        })
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.container}>
                <TopBar onChangePath={(path) => { this.changeCurrentPath(path) }} path={this.state.currentPath} />
                <div className={classes['flex-container']}>
                    <DirectoryBrowser
                        drawStrategy={this.state.drawStrategy}
                        currentPath={this.state.currentPath}
                        onChangePath={(path) => { this.changeCurrentPath(path) }}
                        showHidden={this.state.showHidden}
                    />
                </div>
            </div>
        )
    }
}

export default withStyles(style)<ComponentProps>(MainWindowView)