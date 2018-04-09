import merge from "webpack-merge"
import mainConfig from "./webpack.config.main.dev"
import rendConfig from "./webpack.config.rend.dev"
import webpack from "webpack"

const configs: webpack.Configuration[] = [mainConfig, rendConfig]

export default configs