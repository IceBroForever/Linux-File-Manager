import fs from "fs"
import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CleanWebpackPlugin from "clean-webpack-plugin"

const viewFilesNames = fs.readdirSync(path.resolve(__dirname, "src/views"))
const viewNames = [];
for(let viewFileName of viewFilesNames){
    let match = /(.*)-renderer.tsx/.exec(viewFileName)
    if(match) viewNames.push(match[1])
}

let entries: { [index: string]: string } = {}
for(let viewName of viewNames){
    entries[viewName] = `./src/views/${viewName}-renderer.tsx`
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
                
            },
            {
                test: [/\.css$/],
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: [/\.woff(2)?$/],
                loader: 'file-loader'
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
                title: viewName,
                template: './src/template.html'
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