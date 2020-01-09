const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './src/sass/login.sass'),
    output: {
        path: path.resolve(__dirname, './output/styles'),
        filename: 'login.js'
    },
    module: {
        rules: [{
            test: /\.sass$/,
            use: [
                // style-loader
                { loader: 'style-loader' },
                // css-loader
                { loader: 'css-loader', },
                // sass-loader
                { loader: 'sass-loader' }
            ]
        }]
    }
};