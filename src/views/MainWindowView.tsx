import * as React from "react";
import withStyles from "material-ui/styles/withStyles"
import { WithStyles } from "material-ui/styles/withStyles"
import TopBar from "../components/TopBar"

const style = () => ({})

type ComponentProps = Object
type WithStyleComponentProps = ComponentProps & WithStyles

class MainWindowView extends React.Component<WithStyleComponentProps, {}> {

    render() {
        return (
            <TopBar/>
        )
    }
}

export default withStyles(style)<ComponentProps>(MainWindowView)