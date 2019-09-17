const merge = require( "webpack-merge" );

const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const UglifyJsPlugin = require( "uglifyjs-webpack-plugin" );
const OptimizeCSSAssetsPlugin = require( "optimize-css-assets-webpack-plugin" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );

const common = require( "./webpack.common.js" );


module.exports = ( env, argv ) => merge.smart( common( env, argv ), {
	mode: "production",

	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: [
								require( "autoprefixer" ),
							]
						}
					},
					"sass-loader",
				],
			},
		],
	},

	optimization: {
		runtimeChunk: "single",
		moduleIds: "hashed",
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
					preset: [
						"default",
						{ discardComments: { removeAll: true } },
					],
				},
			} )
		]
	},

	plugins: [
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
	],
} );
