import DrawStrategyProps from "./DrawStrategyProps"
import withStyles, { WithStyles } from "material-ui/styles/withStyles"
import withTheme, { WithTheme } from "material-ui/styles/withTheme"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import createMuiTheme from "material-ui/styles/createMuiTheme"
import FolderIcon from "@material-ui/icons/Folder"
import FileIcon from "@material-ui/icons/InsertDriveFile"
import { Description, FolderDescription, FileDescription } from "../../../common/Descriptions"
import React from "react";
const { app } = require("electron").remote

const styles = () => ({
    container: {
        position: 'relative' as 'relative',
        width: '100%',
        display: 'flex',
        flexWrap: 'nowrap' as 'nowrap',
        "align-items": 'center'
    },
    icon: {
        position: 'relative' as 'relative',
        width: '30px',
        height: '30px',
        margin: '5px 10px'
    },
    name: {
        position: 'relative' as 'relative',
        width: '150px',
        overflow: 'hidden' as 'hidden',
        textOverflow: 'ellipsis',
        marginRight: '10px'
    },
    type: {
        position: 'relative' as 'relative',
        width: '100px',
        overflow: 'hidden' as 'hidden',
        textOverflow: 'ellipsis',
        marginRight: '10px'
    },
    size: {
        position: 'relative' as 'relative',
        width: '100px',
        overflow: 'hidden' as 'hidden',
        textOverflow: 'ellipsis',
        marginRight: '10px'
    },
    time: {
        position: 'relative' as 'relative',
        width: '200px',
        overflow: 'hidden' as 'hidden',
        textOverflow: 'ellipsis',
        marginRight: '10px'
    }
})

const theme = createMuiTheme({
    palette: {
        secondary: {
            main: "#ffffff"
        }
    }
})

type DrawStrategyPropsWithTheme = DrawStrategyProps & WithTheme
type DrawStrategyPropsWithStyles = DrawStrategyPropsWithTheme
    & WithStyles<'container' | 'icon' | 'name' | 'type' | 'size' | 'time'>

class ListDrawStrategyInternal extends React.Component<DrawStrategyPropsWithStyles> {
    state = {
        path: this.props.description.path
    }

    onClick(event) {
        event.stopPropagation();
        const { id, onSelect } = this.props
        onSelect(id);
    }

    onDoubleClick(event) {
        event.stopPropagation();
        const { id, description, onDoubleClick } = this.props
        onDoubleClick(id);
    }

    render() {
        const { theme, classes, description, selected, id, showHidden } = this.props

        if (description.name.charAt(0) == '.' && !showHidden) return null;

        let filename: string = description.name
        let type = 'Folder'
        let Icon = FolderIcon
        if ("ext" in description) {
            Icon = FileIcon
            type = description.ext.toUpperCase() + ' file'
        }

        let size;
        if (description.size / 1073741824 > 1) size = `${Math.round(description.size / 1073741824 * 100) / 100} Gb`
        else if (description.size / 1048576 > 1) size = `${Math.round(description.size / 1048576 * 100) / 100} Mb`
        else if (description.size / 1024 > 1) size = `${Math.round(description.size / 1024 * 100) / 100} Kb`
        else size = `${description.size} b`

        return (
            <div
                className={classes.container}
                style={{
                    backgroundColor: selected
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                    opacity: description.name.charAt(0) == '.' ? 0.7 : 1
                }}
                onClick={(event) => { this.onClick(event) }}
                onDoubleClick={event => { this.onDoubleClick(event) }}
            >
                <Icon
                    className={classes.icon}
                    color={selected ? "secondary" : "primary"}
                />
                <div
                    className={classes.name}
                    style={{
                        color: selected
                            ? theme.palette.primary.contrastText
                            : theme.palette.secondary.contrastText
                    }}
                >
                    {filename}
                </div>
                <div
                    className={classes.type}
                    style={{
                        color: selected
                            ? theme.palette.primary.contrastText
                            : theme.palette.secondary.contrastText
                    }}
                >
                    {type}
                </div>
                <div
                    className={classes.size}
                    style={{
                        color: selected
                            ? theme.palette.primary.contrastText
                            : theme.palette.secondary.contrastText
                    }}
                >
                    {size}
                </div>
                <div
                    className={classes.time}
                    style={{
                        color: selected
                            ? theme.palette.primary.contrastText
                            : theme.palette.secondary.contrastText
                    }}
                >
                    {new Date(description.created).toLocaleString()}
                </div>
            </div>
        );
    }
}

const StyledIconDrawStrategy = withTheme()<DrawStrategyProps>(withStyles(styles)<DrawStrategyPropsWithTheme>(ListDrawStrategyInternal))

export default class ListDrawStrategy extends React.Component<DrawStrategyProps>{
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <StyledIconDrawStrategy {...this.props} />
            </MuiThemeProvider>
        );
    }
}