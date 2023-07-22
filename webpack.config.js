const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                },
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },

    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css",
            chunkFilename: "[id].css",
        }),
    ],
};
