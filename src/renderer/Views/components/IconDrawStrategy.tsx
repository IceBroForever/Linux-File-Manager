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
        width: '110px',
        display: 'flex',
        "justify-content": 'center',
        "align-items": 'center',
        flexDirection: 'column' as 'column'
    },
    icon: {
        position: 'relative' as 'relative',
        width: '70px',
        height: '70px',
        marginBottom: '10px',
        marginTop: '10px'
    },
    name: {
        position: 'relative' as 'relative',
        width: '100px',
        textAlign: 'center' as 'center',
        overflow: 'hidden' as 'hidden',
        textOverflow: 'ellipsis',
        marginBottom: '5px'
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
type DrawStrategyPropsWithStyles = DrawStrategyPropsWithTheme & WithStyles<'container' | 'icon' | 'name'>

class IconDrawStrategyInternal extends React.Component<DrawStrategyPropsWithStyles> {
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
        let Icon = FolderIcon
        if ("ext" in description) {
            if ((description as FileDescription).ext.length != 0)
                filename += '.' + (description as FileDescription).ext
            Icon = FileIcon
        }

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
            </div>
        );
    }
}

const StyledIconDrawStrategy = withTheme()<DrawStrategyProps>(withStyles(styles)<DrawStrategyPropsWithTheme>(IconDrawStrategyInternal))

export default class IconDrawStrategy extends React.Component<DrawStrategyProps>{
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <StyledIconDrawStrategy {...this.props} />
            </MuiThemeProvider>
        );
    }
}