import fs from "fs"
import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CleanWebpackPlugin from "clean-webpack-plugin"

const viewFilesNames = fs.readdirSync(path.resolve(__dirname, "src/views"))
const viewNames = viewFilesNames.map((viewPath) => (/(.*).ts(x)?/.exec(viewPath) || [])[1])

let entries: { [index: string]: string } = {}
for(let viewName of viewNames){
    entries[viewName] = `./src/views/${viewName}.tsx`
}

const config: webpack.Configuration = {
    mode: 'development',
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'build', 'views'),
        filename: '[name]/index.js'
    },
    module: {
        rules: [
            {
                test: [/\.ts$/, /\.tsx$/],
                include: [path.resolve(__dirname, 'src')],
                loader: 'awesome-typescript-loader',
                
            }
        ]
    },
    devtool: 'eval',
    target: 'electron-renderer',
    plugins: [
        ...viewNames.map((viewName) =>
            new HtmlWebpackPlugin({
                filename: `${viewName}/index.html`,
                chunks: [viewName],
                title: viewName
            })
        ),
        new webpack.NoEmitOnErrorsPlugin(),
        new CleanWebpackPlugin([
            'build/views'
        ])
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
}

export default config