import * as React from "react"
import withStyles, { WithStyles } from "material-ui/styles/withStyles"
import RemoteFileSystem from "../../RemoteFileSystem/RemoteFileSystem"
import { Description } from "../../../common/Descriptions";
import CircularProgress from 'material-ui/Progress/CircularProgress';
import FileRunner from '../../FileRunner'

const style = () => ({
    container: {
        display: 'flex',
        overflow: 'auto' as 'auto',
        flex: 1,
        "flex-wrap": "wrap",
        "align-items": "flex-start",
        "align-content": "flex-start"
    },
    loading: {
        flex: 1,
        display: 'flex',
        "justify-content": 'center',
        "align-items": 'center'
    }
})

type Content = {
    description: Description,
    id: number,
    selected: boolean
}

type ComponentState = {
    path: string,
    content: Content[],
    drawStrategy: any,
    watcherId: number
}

type ComponentProps = {
    drawStrategy: any,
    currentPath: string,
    onChangePath: (path: string) => void,
    showHidden: boolean
}
type ComponentPropsWithStyles = ComponentProps & WithStyles<'container' | 'loading'>

class DirectoryBrowser extends React.Component<ComponentPropsWithStyles, ComponentState>{
    state = {
        path: this.props.currentPath,
        content: null,
        drawStrategy: this.props.drawStrategy,
        watcherId: null
    }

    private async loadContent(): Promise<Content[]> {
        let descs: Description[] = await RemoteFileSystem.getContent(this.state.path);
        descs = descs.sort((a, b) => { return a.name > b.name ? 1 : -1 })
        return descs.map((desc, i) => ({
            description: desc,
            id: i,
            selected: false
        }))
    }

    private async pathUpdated() {
        let { watcherId } = this.state
        if (this.state.watcherId) await RemoteFileSystem.removeListenerForChanges(this.state.watcherId)
        watcherId = await RemoteFileSystem.setListenerForChanges(this.state.path, async (id) => {
            this.setState({
                content: await this.loadContent()
            })
        })
        this.setState({
            content: await this.loadContent(),
            watcherId
        })
    }

    static getDerivedStateFromProps(nextProps: ComponentProps, prevState: ComponentState) {
        return {
            path: nextProps.currentPath,
            content: nextProps.currentPath == prevState.path ? prevState.content : null,
            drawStrategy: nextProps.drawStrategy
        }
    }

    componentDidMount() {
        this.pathUpdated();
    }

    componentDidUpdate() {
        if (this.state.content == null) {
            this.pathUpdated();
        }
    }

    private onSelection(id: number) {
        let content = this.state.content.slice();
        for (let entity of content) {
            if (entity.id == id) entity.selected = true
            else entity.selected = false
        }
        this.setState({
            content
        })
    }

    private onDoubleClick(id: number) {
        if ('ext' in this.state.content[id].description)
            FileRunner.run(this.state.content[id].description.path)
        else this.props.onChangePath(this.state.content[id].description.path)
    }

    render() {
        const { classes } = this.props

        if (this.state.content == null) {
            return (
                <div className={classes.loading}>
                    <CircularProgress size={100} color="primary" />
                </div>
            )
        }

        const DrawStrategy = this.state.drawStrategy

        let elements = this.state.content.map(entity => {
            const { description, id, selected } = entity
            return (
                <DrawStrategy
                    key={id}
                    description={description}
                    id={id}
                    selected={selected}
                    onSelect={(index) => { this.onSelection(index) }}
                    onDoubleClick={(index) => { this.onDoubleClick(index) }}
                    showHidden={this.props.showHidden}
                />
            )
        })

        return (
            <div
                className={classes.container}
                onClick={() => { this.onSelection(-1) }}
            >
                {...elements}
            </div>
        );
    }
}

export default withStyles(style)<ComponentProps>(DirectoryBrowser)