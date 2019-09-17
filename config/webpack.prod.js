const path = require( "path" );
const webpack = require( "webpack" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const UglifyJsPlugin = require( "uglifyjs-webpack-plugin" );
const OptimizeCSSAssetsPlugin = require( "optimize-css-assets-webpack-plugin" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const FaviconsWebpackPlugin = require( "favicons-webpack-plugin" );


const SRC_DIR = path.resolve( __dirname, "../src/assets/" );

module.exports = ( env ) => ({
	mode: "production",

	entry: {
		"bundle": path.resolve( SRC_DIR, "entry-point.js" ),
	},

	resolve: {
		alias: {
			"/assets": SRC_DIR,
		},
	},

	output: {
		path: env.DIST,
		filename: "assets/[name].[contenthash].js",
	},

	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "../"
						}
					},
					{
						loader: "css-loader",
						options: {
							minimize: true,
							discardComments: { removeAll: true },
						},
					},
					{
						loader: "postcss-loader",
						options: {
							plugins: [
								require( "autoprefixer" ),
							]
						}
					},
					{
						loader: "sass-loader"
					}
				],
			},
			{
				test: /fonts\/.*\.(woff|svg|eot|ttf|woff2)$/,
				loader: [
					{
						loader: "url-loader",
						query: {
							limit: 1024,
							name: "/assets/[name].[contenthash].[ext]",
						},
					},
					"image-webpack-loader",
				],
			},
			{
				test: /\.(gif|png|jpe?g|svg|ico)$/i,
				exclude: /node_modules|semantic-ui/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "/assets/[name].[contenthash].[ext]",
						},
					},
					"image-webpack-loader",
				],
			},
		],
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /node_modules|semantic-ui/,
					chunks: "initial",
					name: "vendor",
					priority: 10,
					enforce: true,
				},
			},
		},
		minimizer: [
			new UglifyJsPlugin( {
				cache: true,
				parallel: true,
				sourceMap: false,
				uglifyOptions: {
					output: {
						comments: false,
						beautify: false,
					},
				},
			} ),
			new OptimizeCSSAssetsPlugin( {
				cssProcessorPluginOptions: {
					preset: [ "default", { discardComments: { removeAll: true } } ],
				},
			} )
		]
	},

	plugins: [
		new MiniCssExtractPlugin( {
			filename: "assets/[name].[contenthash].css",
		} ),
		new webpack.ProvidePlugin( {
			$: "jquery",
			jQuery: "jquery",
		} ),
		new webpack.DefinePlugin( {
			"process.env": {
				"NODE_ENV": JSON.stringify( "production" ),
			},
		} ),
		...env.files.map( file => new HtmlWebpackPlugin( {
			filename: file,
			template: file,
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true,
				minifyJS: true,
			},
		} ) ),
		new FaviconsWebpackPlugin( path.resolve( SRC_DIR, "images/carbon-ldp-iconograph_500x478.png" ) ),
	],
});
