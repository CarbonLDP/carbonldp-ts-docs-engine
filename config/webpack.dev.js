const path = require( "path" );
const webpack = require( "webpack" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );


const SRC_DIR = path.resolve( __dirname, "../src/assets/" );

module.exports = ( env ) => ({
	mode: "development",

	entry: {
		"bundle": path.resolve( SRC_DIR, "entry-point.js" ),
	},

	output: {
		path: env.DIST,
		filename: "assets/bundle.js",
	},

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
			{
				test: /fonts\/.*\.(woff|svg|eot|ttf|woff2)$/,
				loader: [
					{
						loader: "url-loader",
						query: {
							limit: 1024,
							name: "/assets/[name].[ext]",
						},
					},
				],
			},
		],
	},

	plugins: [
		new MiniCssExtractPlugin( {
			filename: "assets/styles.css",
			chunkFilename: "assets/styles.css",
		} ),
		new webpack.ProvidePlugin( {
			$: "jquery",
			jQuery: "jquery",
		} ),
		new webpack.DefinePlugin( {
			"process.env": {
				"NODE_ENV": JSON.stringify( "development" ),
			},
		} ),
	],
});
