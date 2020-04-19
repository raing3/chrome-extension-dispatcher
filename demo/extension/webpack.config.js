const path = require('path');
const ExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const manifest = require('./src/manifest.json');

module.exports = {
    entry: {
        'background': path.resolve(__dirname, "./src/js/background.ts"),
        'content': path.resolve(__dirname, "./src/js/content.ts"),
        'content-external': path.resolve(__dirname, "./src/js/content-external.ts")
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "js/[name].js"
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    plugins: [
        new ExtensionManifestPlugin({
            config: {
                base: manifest
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'inline-cheap-source-map'
};