import * as React from "react";
import IconButton from "material-ui/IconButton"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import withStyles, { WithStyles } from "material-ui/styles/withStyles"
import createMuiTheme from "material-ui/styles/createMuiTheme"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import red from "material-ui/colors/red"

const style = () => ({
    container: {
        marginLeft: "-15px"
    },
    button: {
        "-webkit-app-region": "no-drag"
    }
})

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#ffffff"
        }
    }
})

type ComponentState = {
    history: string[],
    current: number
}

type ComponentProps = {
    path: string,
    onChangePath: (path: string) => void
}
type ComponentPropsWithStyle = ComponentProps & WithStyles<'button' | 'container'>

class NavigationButtons extends React.Component<ComponentPropsWithStyle, ComponentState>{
    state = {
        history: [this.props.path],
        current: 0
    }

    private onNext() {
        const { history, current } = this.state
        this.props.onChangePath(history[current + 1])
    }

    private onPrev() {
        const { history, current } = this.state
        this.props.onChangePath(history[current - 1])
    }

    static getDerivedStateFromProps(nextProps: ComponentProps, prevState: ComponentState) {
        if (nextProps.path == prevState.history[prevState.current]) return null
        else if (nextProps.path == prevState.history[prevState.current + 1])
            return {
                current: prevState.current + 1
            }
        else if (nextProps.path == prevState.history[prevState.current - 1])
            return {
                current: prevState.current - 1
            }
        else {
            let history = prevState.history.slice(0, prevState.current + 1)
            history.push(nextProps.path)
            return {
                history,
                current: prevState.current + 1
            }
        }
    }

    render() {
        const { classes } = this.props
        const { history, current } = this.state

        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.container}>
                    <IconButton
                        color="primary"
                        className={classes.button}
                        onClick={() => { this.onPrev() }}
                        disabled={current == 0}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        className={classes.button}
                        onClick={() => { this.onNext() }}
                        disabled={current == history.length - 1}
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(style)<ComponentProps>(NavigationButtons);