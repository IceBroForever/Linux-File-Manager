import * as React from "react";
import withStyles, { WithStyles } from "material-ui/styles/withStyles"
import TopBar from "./components/TopBar"
import DirectoryBrowser from "./components/DirectoryBrowser"
import DrawStrategy from "./components/DrawStrategy"
import FolderElement from "./components/FolderElement"

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
    },
    treeContainer: {
        position: 'relative' as 'relative',
        width: '200px',
        height: '100%',
        borderRight: '2px solid #616161',
        overflow: 'auto' as 'auto'
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
type WithStyleComponentProps = ComponentProps & WithStyles<"flex-container" | 'container' | 'treeContainer'>

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

    changeDrawStrategy(drawStrategy: any, showHidden: boolean) {
        this.setState({
            drawStrategy,
            showHidden
        })
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.container}>
                <TopBar
                    onChangePath={(path) => { this.changeCurrentPath(path) }}
                    path={this.state.currentPath}
                    drawStrategy={this.state.drawStrategy}
                    showHidden={this.state.showHidden}
                    onDrawStrategyChanged={(drawStrategy, showHidden) => {
                        this.changeDrawStrategy(drawStrategy, showHidden)
                    }}
                />
                <div className={classes['flex-container']}>
                    <div className={classes.treeContainer}>
                        <FolderElement showHidden={this.state.showHidden} onDoubleClick={(path) => { this.changeCurrentPath(path) }} />
                    </div>
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