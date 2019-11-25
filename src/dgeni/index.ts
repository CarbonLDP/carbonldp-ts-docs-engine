import { Package } from "dgeni";
import path from "path";

import { paramInLineTag } from "./inline-tags-def/paramInlineTag"
import { multipleExports } from "./processors/multipleExports";

import { navigationProcessor } from "./processors/navigation";
import { normalizeDocsProcessor } from "./processors/normalizeDocs";

import "./rendering/config-marked";

import { highlightFilter } from "./rendering/filters/highlight";
import { linkifyFilter } from "./rendering/filters/linkify";
import { nullifyEmptyFilter } from "./rendering/filters/nullifyEmpty";
import { highlightTag } from "./rendering/tags/highlight";


// Paths configuration.
const sourceDir = path.resolve( process.cwd(), "src/" );
const outputDir = path.resolve( process.cwd(), "docs/" );
const templateDir = path.resolve( __dirname, "../templates/" );

export const apiDocsPackage = new Package( "ts-docs-engine", [
	require( "dgeni-packages/jsdoc" ),
	require( "dgeni-packages/nunjucks" ),
	require( "dgeni-packages/typescript" ),
	require( "dgeni-packages/links" ),
	require( "dgeni-packages/git" ),
] )

	.processor( navigationProcessor )
	.processor( normalizeDocsProcessor )
	.processor( multipleExports )

	// Configure the processor for reading files from the file system.
	.config( function( readFilesProcessor:any, writeFilesProcessor:any ) {
		readFilesProcessor.basePath = sourceDir;
		readFilesProcessor.$enabled = false; // disable for now as we are using readTypeScriptModules

		writeFilesProcessor.outputFolder = outputDir;
	} )

	// Configure the output path for written files (i.e., file names).
	.config( function( gitData:any, checkAnchorLinksProcessor:any, computePathsProcessor:any, computeIdsProcessor:any ) {
		// Set empty, to allow only relative URLs
		checkAnchorLinksProcessor.webRoot = "";
		checkAnchorLinksProcessor.base = gitData.version.isSnapshot ? "/" : `/${ gitData.info.repo }/`;

		computePathsProcessor.pathTemplates.push( {
			docTypes: [ "module", "class", "interface", "function", "enum", "type-alias", "const" ],
			pathTemplate: "${id}",
			outputPathTemplate: "${id}/index.html",
		} );

		computePathsProcessor.pathTemplates.push( {
			docTypes: [ "index" ],
			pathTemplate: ".",
			outputPathTemplate: "${id}.html",
		} );

		computeIdsProcessor.idTemplates.push( {
			docTypes: [ "index" ],
			idTemplate: "index",
			// getAliases: () => [ "index" ],
		} );
	} )

	// Configure the processor for understanding TypeScript.
	.config( function( readTypeScriptModules:any ) {
		readTypeScriptModules.basePath = sourceDir;
		readTypeScriptModules.hidePrivateMembers = false;

		// Entry points for docs generation.
		readTypeScriptModules.sourceFiles = [
			{
				include: "**/*.ts",
				exclude: "**/*.spec.ts",
			},
		];
	} )

	// Configure the processor to accept the '@param' tag.
	.config( function( inlineTagProcessor:any, getInjectables:any ) {
		inlineTagProcessor.inlineTagDefinitions.push( ...getInjectables( [
			paramInLineTag
		] ) )
	} )

	// Configure processor for finding nunjucks templates.
	.config( function( templateFinder:any ) {
		// Where to find the templates for the doc rendering
		templateFinder.templateFolders = [
			templateDir,
			path.resolve( templateDir, "partials/" ),
			path.resolve( templateDir, "macros/" ),
		];

		// Standard patterns for matching docs to templates
		templateFinder.templatePatterns = [
			"${ doc.docType }.template.njk",
			"${ doc.docType }.macro.njk",
		];
	} )
	.config( function( templateEngine:any, getInjectables:any ) {
		templateEngine.filters.push( ...getInjectables( [
			linkifyFilter,
			nullifyEmptyFilter,
			highlightFilter,
		] ) );
		templateEngine.tags.push( ...getInjectables( [
			highlightTag,
		] ) );
	} );
