import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CleanWebpackPlugin from "clean-webpack-plugin"

const config: webpack.Configuration = {
    mode: 'development',
    entry: {
        test: './src/views/test.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'build', 'views'),
        filename: '[name]/index.js'
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
    target: 'electron-renderer',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'test/index.html',
            chunks: ['test']
        }),
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