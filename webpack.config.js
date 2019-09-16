module.exports = ( env, argv ) =>
	argv && argv.mode === "production"
		? require( "./config/webpack.prod.js" )( env, argv )
		: require( "./config/webpack.dev.js" )( env, argv )
;