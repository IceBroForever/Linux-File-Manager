import * as React from 'react'
import withStyles, { WithStyles } from 'material-ui/styles/withStyles'
import { FileDescription } from "../common/Descriptions"
import FileIcon from "@material-ui/icons/InsertDriveFile"
import OpenFolderIcon from "@material-ui/icons/FolderOpen"

const styles = () => ({
    container: {
        display: 'flex',
        width: '150px',
        padding: '10px',
        alignItems: 'center',
        alignContent: 'center'
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
    file: FileDescription
}
type ComponentProps = {
    file: FileDescription
}
type ComponentPropsWithStyle = ComponentProps & WithStyles<'container' | 'icon' | 'name'>

class FileElement extends React.Component<ComponentPropsWithStyle, ComponentState>{
    state = {
        file: this.props.file
    }

    private handleClick(event) {
        event.stopPropagation();
    }

    render() {
        const { classes } = this.props

        let filename: string = this.state.file.name
        if (this.state.file.ext.length != 0)
            filename += '.' + this.state.file.ext

        return (
            <div>
                <div className={classes.container} onClick={(event) => { this.handleClick(event) }}>
                    <FileIcon className={classes.icon} />
                    <div className={classes.name}>{filename}</div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)<ComponentProps>(FileElement);