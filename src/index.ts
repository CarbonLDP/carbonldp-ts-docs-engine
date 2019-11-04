import { Dgeni } from "dgeni";
import { ApiDoc } from "dgeni-packages/typescript/api-doc-types/ApiDoc";
import * as path from "path";
import { apiDocsPackage } from "./dgeni";
import webpack = require("webpack");
import winston = require("winston");


namespace DocsEngine {
	export interface Options {
		src:string;
		out:string;
		mode:"production" | "development";
		logLevel?:"error" | "warn" | "info" | "verbose" | "debug" | "silly";
		npmName?:string;
		name?:string;
		descriptionTemplate?:string;
		mainClass?:string;
	}

	export interface InternalOptions extends Options {
		log:winston.Logger;
	}

	export interface Project {
		name:string;
		npmName:string;
		mainClass:string;
		descriptionTemplate:string;
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
			.config( function( renderDocsProcessor:any ) {
				renderDocsProcessor.extraData.project = <Project>{
					name: options.name,
					npmName: options.npmName,
					mainClass: options.mainClass,
					descriptionTemplate: path.basename( options.descriptionTemplate! )
				};
			} )
			.config( function( templateFinder:any ) {
				templateFinder.templateFolders
					.push( path.dirname( options.descriptionTemplate! ) );
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

	async function bundle( options:InternalOptions, files:string[] ):Promise<void> {
		options.log.info( `=== Bundle and process HTML ===` );
		return new Promise( ( resolve, reject ) => {
			const config:webpack.Configuration = require( "../webpack.config" )(
				{ DIST: options.out, files },
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
				if( stats.hasErrors() ) reject( new Error( stats.toString( "errors-only" ) ) );
				else resolve();
			} );
		} )
	}


	async function parseOptions( options:Options ):Promise<InternalOptions> {
		let npmName = __getPackageName( options );
		let name = __getName( options, npmName );
		let mainClass = __getMainClass( options, npmName );
		let descriptionTemplate = __getDescriptionTemplate( options );

		// Default values
		const preOptions = Object.assign(
			{
				logLevel: "info",
				npmName: npmName,
				name: name,
				mainClass: mainClass,
				descriptionTemplate: descriptionTemplate
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
		const internalOptions = await parseOptions( options );

		const files = await generateHTML( internalOptions );
		await bundle( internalOptions, files );
	}

	function __getPackageName( options:Options ):string {
		if( options.npmName ) return options.npmName;
		if( process.env.npm_package_name ) return process.env.npm_package_name;
		return path.basename( process.cwd() );
	}

	function __getName( options:Options, npmName:string ) {
		if( options.name ) return options.name;

		npmName = __removePunctuation( npmName );

		let emphasiseLetters:RegExp = /^(.?)|( .)/g;
		return npmName.replace( emphasiseLetters, function( match ) { return match.toUpperCase(); } );

	}

	function __getDescriptionTemplate( options:Options ):string {
		return options.descriptionTemplate ? options.descriptionTemplate : path.resolve( process.cwd(), "build/docs/templates/description-template.njk" );
	}

	function __getMainClass( options:Options, npmName:string ):string {
		if( options.mainClass ) return options.mainClass;

		// Removes punctuation and capitalizes class name for PascalCase convention
		let className = npmName.replace( /\w+/g, match => {
			return match[ 0 ].toUpperCase() + match.slice( 1 ).toLowerCase();
		} );

		let punctuationMatcher:RegExp = /([-_.\/])/g;
		return className.replace( punctuationMatcher, "" );
	}

	function __removePunctuation( str:string ):string {
		let punctuationMatcher:RegExp = /([-_.\/])/g;
		str = str.replace( punctuationMatcher, " " );

		// If the first or last character was a special symbol, remove extra space
		let normalizeName:RegExp = /^( )|( )$/g;
		return str.replace( normalizeName, "" );
	}

}

export { DocsEngine }
export default DocsEngine;
