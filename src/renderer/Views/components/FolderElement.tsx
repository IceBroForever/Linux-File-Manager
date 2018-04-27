import * as React from 'react'
import withStyles, { WithStyles } from 'material-ui/styles/withStyles'
import { FileDescription, FolderDescription, Description } from "../../../common/Descriptions"
import RemoteFileSystem from "../../RemoteFileSystem/RemoteFileSystem"
import FolderIcon from "@material-ui/icons/Folder"
import OpenFolderIcon from "@material-ui/icons/FolderOpen"
import FileElement from "./FileElement"

const styles = () => ({
    container: {
        display: 'flex',
        width: '150px',
        padding: '10px',
        alignItems: 'center',
        alignContent: 'center'
    },
    childContainer: {
        marginLeft: '30px'
    },
    icon: {
        width: '20px',
        height: '20px',
        marginRight: '10px'
    },
    name: {
        flex: 1
    }
})

type ComponentState = {
    folder: FolderDescription
    childs: any,
    watcherId: number,
    expanded: boolean
}
type ComponentProps = {
    folder?: FolderDescription,
    onDoubleClick: (path: string) => void,
    showHidden: boolean
}
type ComponentPropsWithStyle = ComponentProps & WithStyles<'container' | 'icon' | 'name' | 'childContainer'>

class FolderElementInternal extends React.Component<ComponentPropsWithStyle, ComponentState>{
    state = {
        folder: this.props.folder ? this.props.folder : { path: '/', name: '/' } as FolderDescription,
        childs: null,
        watcherId: null,
        expanded: false
    }

    private async loadContent(): Promise<any[]> {
        let content: Description[] = await RemoteFileSystem.getContent(this.state.folder.path);
        content = content.sort((a, b) => { return a.name > b.name ? 1 : -1 })
        return this.generateChildElements(content)
    }

    private handleClick(event) {
        event.stopPropagation();
        if (this.state.expanded) this.disexpand()
        else this.expand()
    }

    private async expand() {
        let watcherId = await RemoteFileSystem.setListenerForChanges(this.state.folder.path, (id) => {
            this.loadContent()
        })
        let childs = await this.loadContent()
        this.setState({
            watcherId,
            childs,
            expanded: true
        })
    }

    private async disexpand() {
        await RemoteFileSystem.removeListenerForChanges(this.state.watcherId);
        this.setState({
            watcherId: null,
            childs: null,
            expanded: false
        })
    }

    private generateChildElements(descs: Description[]) {
        return descs.map(entity => {
            if(entity.name.charAt(0) == '.') return null
            if ('ext' in entity) return <FileElement file={entity} />
            return <FolderElement showHidden={this.props.showHidden} folder={entity} onDoubleClick={this.props.onDoubleClick} />
        })
    }

    render() {
        const { classes } = this.props

        let childs = this.state.expanded ? this.state.childs : []
        let Icon = this.state.expanded ? OpenFolderIcon : FolderIcon

        return (
            <div>
                <div 
                className={classes.container} 
                onClick={(event) => { this.handleClick(event) }}
                onDoubleClick={(event) => {
                    event.stopPropagation()
                    this.props.onDoubleClick(this.state.folder.path)
                }}
                >
                    <Icon className={classes.icon}/>
                    <div className={classes.name}>{this.state.folder.name}</div>
                </div>
                <div className={classes.childContainer}>
                    {...childs}
                </div>
            </div>
        )
    }
}

const FolderElement = withStyles(styles)<ComponentProps>(FolderElementInternal)
export default FolderElement