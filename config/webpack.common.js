const path = require( "path" );

const webpack = require( "webpack" );

const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const FaviconsWebpackPlugin = require( "favicons-webpack-plugin" );


const SRC_DIR = path.resolve( __dirname, "../src/assets/" );

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
			"/assets": SRC_DIR,
		},
	},

	output: {
		path: env.DIST,
		filename: `assets/${getName( argv, "js" )}`,
	},

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
							name: `/assets/${getName( argv )}`,
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
				exclude: /node_modules|semantic-ui/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: `/assets/${getName( argv )}`,
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
			filename: `assets/${getName( argv, "css" )}`,
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
		new FaviconsWebpackPlugin( path.resolve( SRC_DIR, "images/carbon-ldp-iconograph_500x478.png" ) ),
	],
});
