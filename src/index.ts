import { Dgeni } from "dgeni";
import { ApiDoc } from "dgeni-packages/typescript/api-doc-types/ApiDoc";
import * as path from "path";
import { apiDocsPackage } from "./dgeni";
import webpack = require("webpack");
import winston = require("winston");

declare module "webpack" {
	namespace Stats {
		function presetToOptions( name:webpack.Stats.Preset ):webpack.Stats.ToJsonOptionsObject;
	}
}

namespace DocsEngine {
	export interface Options {
		src:string;
		out:string;
		mode:"production" | "development";
		logLevel?:"error" | "warn" | "info" | "verbose" | "debug" | "silly";
	}

	export interface InternalOptions extends Options {
		log:winston.Logger
	}


	async function generateHTML( options:InternalOptions ):Promise<string[]> {
		options.log.info( `=== Generate HTML with Dgeni ===` );

		const configuredPackage = apiDocsPackage
			.config( function( log:any ) {
				log.level = options.logLevel;
			} )
			.config( function( readFilesProcessor:any, readTypeScriptModules:any ) {
				readFilesProcessor.basePath = options.src;
				readTypeScriptModules.basePath = options.src;
			} )
			.config( function( writeFilesProcessor:any ) {
				writeFilesProcessor.outputFolder = options.out;
			} )
		;

		const docs:ApiDoc[] = await new Dgeni( [ configuredPackage ] )
			.generate();

		return docs
			.filter( doc => doc.outputPath )
			.map( doc => path.resolve( options.out, doc.outputPath ) );
	}


	function getPresetFromLevel( options:InternalOptions ):webpack.Stats.Preset {
		switch( options.logLevel ) {
			case "error":
				return "errors-only";
			case "warn":
				return "errors-warnings";
			case "info":
				return "normal";
			case "verbose":
			case "debug":
			case "silly":
				return "verbose";
			default:
				return "none";
		}
	}

	async function bundle( options:InternalOptions ):Promise<void> {
		options.log.info( `=== Bundle and process HTML ===` );
		return new Promise( ( resolve, reject ) => {
			const config:webpack.Configuration = require( "../webpack.config" )(
				{ DIST: options.out },
				{ mode: options.mode }
			);

			const preset = getPresetFromLevel( options );
			const statsOptions = webpack.Stats.presetToOptions( preset );

			const compiler = webpack( config );
			compiler.run( ( error, stats:webpack.Stats ) => {
				console.log( stats.toString( {
					...statsOptions,
					colors: true,
				} ) );

				if( error ) reject( error );
				else resolve();
			} );
		} )
	}


	function parseOptions( options:Options ):InternalOptions {
		// Default values
		const preOptions = Object.assign(
			{
				logLevel: "info",
			},
			options,
		);

		// Process options
		return Object.assign(
			preOptions,
			{
				src: path.resolve( process.cwd(), options.src ),
				out: path.resolve( process.cwd(), options.out ),
				log: winston.createLogger( {
					level: options.logLevel,
					transports: new winston.transports.Console( {
						format: winston.format.cli( { all: true } )
					} ),
				} ),
			},
		);
	}

	export async function generate( options:Options ):Promise<void> {
		const internalOptions = parseOptions( options );

		// TODO: Use out files
		const files = await generateHTML( internalOptions );
		await bundle( internalOptions );
	}

}

export { DocsEngine }
export default DocsEngine;
