module.exports = {
    rules: [
        {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
        },
    ],
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
};
