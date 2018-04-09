import path from "path"
import webpack from "webpack"
import CleanWebpackPlugin from "clean-webpack-plugin"

const config: webpack.Configuration = {
    mode: 'development',
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: [/\.ts$/, /\.tsx$/],
                include: [path.resolve(__dirname, 'src')],
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    devtool: 'eval',
    target: 'electron-main',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new CleanWebpackPlugin([
            'build'
        ],{
            exclude: ['views']
        })
    ]
}

export default config