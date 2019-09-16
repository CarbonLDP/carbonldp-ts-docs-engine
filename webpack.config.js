module.exports = ( env, argv ) =>
	argv && argv.mode === "production"
		? require( "./config/webpack.prod.js" )
		: require( "./config/webpack.dev.js" )
;