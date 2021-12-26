const { override, fixBabelImports, addWebpackPlugin } = require('customize-cra');


const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        style: 'css',
    }),
    // 判断环境，只有在生产环境的时候才去使用这个插件
    // 如果不想这样做的话可以只修改build的命令为"build": "react-app-rewired build"
    addWebpackPlugin(
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    drop_debugger: true,
                    drop_console: true,
                    pure_funcs: ['console.log']
                }
            }
        }),
    ),
);
