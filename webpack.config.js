module.exports = ( env, argv ) => {
	if( !env.files ) env.files = [];
	return argv && argv.mode === "production"
		? require( "./config/webpack.prod.js" )( env, argv )
		: require( "./config/webpack.dev.js" )( env, argv )
};
