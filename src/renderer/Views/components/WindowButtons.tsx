import * as React from "react";
import RemoteMainWindow from "../../RemoteMainWindow"
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
import Menu from 'material-ui/Menu'
import Radio, { RadioGroup } from 'material-ui/Radio'
import { FormLabel, FormControl, FormControlLabel, FormHelperText, FormGroup } from 'material-ui/Form'
import DrawStrategy from "./DrawStrategy"
import Checkbox from 'material-ui/Checkbox'

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
    drawStrategy: any,
    showHidden: boolean,
}

type ComponentProps = {
    drawStrategy: any,
    showHidden: boolean,
    onDrawStrategyChanged: (drawStrategy: any, showHidden: boolean) => void
}
type ComponentPropsWithStyle = ComponentProps & WithStyles<'button' | 'container'>

class WindowButtons extends React.Component<ComponentPropsWithStyle, ComponentState>{
    state = {
        menuAnchor: null,
        drawStrategy: this.props.drawStrategy,
        showHidden: this.props.showHidden
    }

    static getDerivedStateFromProps(nextProps: ComponentProps, prevState: ComponentState) {
        return {
            drawStrategy: nextProps.drawStrategy,
            showHidden: nextProps.showHidden
        }
    }

    handleDrawStrategyChanged(drawStrategy: any, showHidden: boolean) {
        this.props.onDrawStrategyChanged(drawStrategy, showHidden)
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
                        id="menu"
                        anchorEl={this.state.menuAnchor}
                        open={this.state.menuAnchor != null}
                        onClose={() => { this.setState({ menuAnchor: null }) }}
                    >
                        <FormGroup>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">View type:</FormLabel>
                                <RadioGroup
                                    aria-label="drawStrategy"
                                    name="drawStrategy"
                                    value={this.props.drawStrategy == DrawStrategy.Icon ? "Icon" : "List"}
                                    onChange={event => {
                                        this.handleDrawStrategyChanged(
                                            DrawStrategy[(event.target as any).value],
                                            this.state.showHidden
                                        )
                                    }}
                                >
                                    <FormControlLabel value="Icon" control={<Radio color="primary" />} label="Icons" />
                                    <FormControlLabel value="List" control={<Radio color="primary" />} label="List" />
                                </RadioGroup>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.showHidden}
                                        onChange={event => {
                                            this.handleDrawStrategyChanged(
                                                this.state.drawStrategy,
                                                !this.state.showHidden
                                            )
                                        }}
                                        color="primary"
                                    />
                                }
                                label="Show hidden"
                            />
                        </FormGroup>
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