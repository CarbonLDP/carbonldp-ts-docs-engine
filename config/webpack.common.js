const path = require( "path" );

const webpack = require( "webpack" );

const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const FaviconsWebpackPlugin = require( "favicons-webpack-plugin" );


const SRC_DIR = path.resolve( __dirname, "../dist/assets/" );

const isProd = ( argv ) =>
	argv.mode === "production";

const getName = ( argv, ext ) =>
	"[name]." +
	(isProd( argv ) ? "[contenthash]." : "") +
	(ext ? ext : "[ext]")
;

module.exports = ( env, argv ) => ({
	mode: "none",

	entry: {
		"main": path.resolve( SRC_DIR, "entry-point.js" ),
	},

	resolve: {
		alias: {
			"/engine-assets": SRC_DIR,
		},
	},

	output: {
		path: path.join( env.DIST, "assets/" ),
		publicPath: "assets/",
		filename: getName( argv, "js" ),
	},

	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "./"
						}
					},
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
							name: getName( argv ),
						},
					},
					{
						loader: "image-webpack-loader",
						options: {
							disable: !isProd( argv ),
						},
					},
				],
			},
			{
				test: /\.(gif|png|jpe?g|svg|ico)$/i,
				// Exclude reloading semantic-ui assets
				exclude: /semantic-ui/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: getName( argv ),
						},
					},
					{
						loader: "image-webpack-loader",
						options: {
							disable: !isProd( argv ),
						},
					},
				],
			},
		],
	},

	plugins: [
		new MiniCssExtractPlugin( {
			filename: getName( argv, "css" ),
		} ),
		new webpack.ProvidePlugin( {
			$: "jquery",
			jQuery: "jquery",
		} ),
		new webpack.DefinePlugin( {
			"process.env": {
				"NODE_ENV": JSON.stringify( argv.mode ),
			},
		} ),
		new FaviconsWebpackPlugin( {
			logo: path.resolve( SRC_DIR, "images/carbon-ldp-iconograph_500x478.png" ),
			publicPath: "./",
			outputPath: "../",
			prefix: "",
		} ),
	],
});
