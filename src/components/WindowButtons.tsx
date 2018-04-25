import * as React from "react";
import RemoteMainWindow from "../views/src/RemoteMainWindow"
import IconButton from "material-ui/IconButton"
import MoreIcon from "@material-ui/icons/MoreHoriz"
import MinimizeIcon from "@material-ui/icons/Remove"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import CloseIcon from "@material-ui/icons/Cancel"
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withStyles, { WithStyles } from "material-ui/styles/withStyles"
import createMuiTheme from "material-ui/styles/createMuiTheme"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import red from "material-ui/colors/red"
import Menu from 'material-ui/Menu';
import ExpansionPanel, {
    ExpansionPanelDetails,
    ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';

const style = () => ({
    container: {
        marginRight: "-15px"
    },
    button: {
        "-webkit-app-region": "no-drag"
    }
})

const theme = createMuiTheme({
    palette: {
        primary: {
            main: red[600]
        },
        secondary: {
            main: "#ffffff"
        }
    }
})

type ComponentState = {
    menuAnchor: any,
    expandedPanel: string
}

type ComponentProps = Object
type ComponentPropsWithStyle = ComponentProps & WithStyles<'button' | 'container'>

class WindowButtons extends React.Component<ComponentPropsWithStyle, ComponentState>{
    state = {
        menuAnchor: null,
        expandedPanel: null
    }

    render() {
        const { classes } = this.props

        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.container}>
                    <IconButton
                        aria-owns={this.state.menuAnchor ? 'menu' : null}
                        aria-haspopup="true"
                        color="secondary"
                        className={classes.button}
                        onClick={event => {
                            this.setState({
                                menuAnchor: event.currentTarget
                            })
                        }}
                    >
                        <MoreIcon />
                    </IconButton>
                    <Menu
                        style={{ width: "100px;" }}
                        id="menu"
                        anchorEl={this.state.menuAnchor}
                        open={this.state.menuAnchor != null}
                        onClose={() => { this.setState({ menuAnchor: null, expandedPanel: null }) }}
                    >
                        <ExpansionPanel
                            expanded={this.state.expandedPanel == 'panel1'}
                            onClick={() => this.setState({ expandedPanel: 'panel1' })}
                        >
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                1
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                Something
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel
                            expanded={this.state.expandedPanel == 'panel2'}
                            onClick={() => this.setState({ expandedPanel: 'panel2' })}
                        >
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                2
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                Something
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Menu>

                    <IconButton color="secondary" className={classes.button} onClick={() => { RemoteMainWindow.minimize() }}>
                        <MinimizeIcon />
                    </IconButton>
                    <IconButton color="secondary" className={classes.button} onClick={() => { RemoteMainWindow.changeFullscreenMode() }}>
                        <FullscreenIcon />
                    </IconButton>
                    <IconButton color="primary" className={classes.button} onClick={() => { RemoteMainWindow.close() }}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(style)<ComponentProps>(WindowButtons);