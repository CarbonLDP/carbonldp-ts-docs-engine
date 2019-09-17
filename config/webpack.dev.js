const merge = require( "webpack-merge" );

const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );

const common = require( "./webpack.common.js" );


module.exports = ( env, argv ) => merge.smart( common( env, argv ), {
	mode: "development",
	devtool: "source-map",

	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader?sourceMap&importLoaders=1",
					"sass-loader?sourceMap",
				],
			},
		],
	},

	plugins: [
		...env.files.map( file => new HtmlWebpackPlugin( {
			filename: file,
			template: file,
		} ) )
	],
} );
