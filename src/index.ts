import { Dgeni } from "dgeni";
import { ApiDoc } from "dgeni-packages/typescript/api-doc-types/ApiDoc";
import * as path from "path";
import { apiDocsPackage } from "./dgeni";
import webpack = require("webpack");
import winston = require("winston");


// Add missing webpack functions types
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
		npmName?: string;
		name?: string;
		descriptionTemplate?: string;
		mainClass?: string;
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
			.config(function(renderDocsProcessor:any) {
				renderDocsProcessor.extraData.name = options.name;
				renderDocsProcessor.extraData.npmName = options.npmName;
				renderDocsProcessor.extraData.descriptionTemplate = options.descriptionTemplate;
				renderDocsProcessor.extraData.mainClass = options.mainClass;
			}) 
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
				if( stats.hasErrors() ) reject( new Error(stats.toString("errors-only")));
				else resolve();
			} );
		} )
	}


	function parseOptions( options:Options ):InternalOptions {

		let npmName = __getPackageName(options);
		let name = __getName(options, npmName);
		let descriptionTemplate = __getDescriptionTemplate(options);
		let mainClass = __getMainClass(options, npmName);

		// Default values
		const preOptions = Object.assign(
			{
				logLevel: "info",
				npmName: npmName,
				name: name,
				descriptionTemplate: descriptionTemplate,
				mainClass: mainClass
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

		const files = await generateHTML( internalOptions );
		await bundle( internalOptions, files );
	}

	function __getPackageName(options:Options):string {
		if (options.npmName) return options.npmName;
		if (process.env.npm_package_name) return process.env.npm_package_name;
		return path.basename(path.resolve()); // Name of the directory of the invoking package
	}

	function __getName(options:Options, npmName:string){
		if (options.name) return options.name;

		let emphaziseLetters:RegExp = /^(.?)|( .)/g;

		npmName = __removePunctuation(npmName);

		return npmName.replace(emphaziseLetters, function(match) { return match.toUpperCase(); });

	}

	function __getDescriptionTemplate(options:Options): string | undefined {
		return options.descriptionTemplate ? options.descriptionTemplate : undefined;
	}

	function __getMainClass(options: Options, npmName: string): string | undefined {

		if (options.mainClass) return options.mainClass;

		return __removePunctuation(npmName);
	}

	function __removePunctuation(str: string): string{
		let punctuationMatcher:RegExp = /(-|_|\.|\/)/g;
		let normalizeName:RegExp = /^( )|( )$/g // If the first or last character was a special symbol, remove extra space

		str = str.replace(punctuationMatcher, " ");
		return str.replace(normalizeName, "");
	}

}

export { DocsEngine }
export default DocsEngine;
