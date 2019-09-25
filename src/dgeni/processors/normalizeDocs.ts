import { Processor, DocCollection } from "dgeni";
import { ClassExportDoc } from "dgeni-packages/typescript/api-doc-types/ClassExportDoc";
import { ContainerExportDoc } from "dgeni-packages/typescript/api-doc-types/ContainerExportDoc";
import { FunctionExportDoc } from "dgeni-packages/typescript/api-doc-types/FunctionExportDoc";
import { InterfaceExportDoc } from "dgeni-packages/typescript/api-doc-types/InterfaceExportDoc";
import { MemberDoc } from "dgeni-packages/typescript/api-doc-types/MemberDoc";
import { MethodMemberDoc } from "dgeni-packages/typescript/api-doc-types/MethodMemberDoc";
import { OverloadInfo } from "dgeni-packages/typescript/api-doc-types/OverloadInfo";
import { Host } from "dgeni-packages/typescript/services/ts-host/host";
import { getExportDocType } from "dgeni-packages/typescript/services/TsParser";
import { SymbolFlags } from "typescript";
import { Logger } from "winston";
import { Document } from "../models/Document";
import { IndexMemberDoc } from "../models/IndexMemberDoc";
import { JSDocMethod } from "../models/JSDocMethod";


const PARAM_REGEX:RegExp = /([^:?]+)(\?)?(?:: (.+))?/;

export function normalizeDocsProcessor( tsHost:Host, log:Logger ):NormalizeDocs {
	return new NormalizeDocs( tsHost, log );
}

export class NormalizeDocs implements Processor {

	$runAfter = [ "processing-docs" ];
	$runBefore = [ "docs-processed" ];
	docs!:Document[];

	private readonly tsHost:Host;
	private readonly log:Logger;

	constructor( tsHost:Host, log:Logger ) {
		this.$runAfter = [ "processing-docs" ];
		this.$runBefore = [ "docs-processed" ];

		this.tsHost = tsHost;
		this.log = log;

	}

	$process( docs:DocCollection ) {
		this.docs = docs;
		docs.forEach( doc => {
			if( [ "module", "index" ].includes( doc.docType ) ) return;

			switch( doc.docType ) {
				case "class":
					this._normalizeClass( doc as ClassExportDoc );
					break;

				case "interface":
					this._normalizeInterface( doc as InterfaceExportDoc );
					break;

				case "function":
					this._normalizeParams( doc as FunctionExportDoc );
					break;
			}
		} );

		// Fixes document link aliases
		docs.forEach(doc => {
			if (doc.docType === "module") {
				doc.aliases.length = 0;
			} else if (doc.docType === "member") {
				doc.aliases.shift();
			} else if (doc.docType  === "interface") {
				if(doc.moduleDoc.id) {
					let fullPath:string = `${doc.moduleDoc.id}/${doc.fileInfo.baseName}`;
					if (doc.originalModule !== fullPath) {
						doc.aliases.length = 0;
					}
				}
			}
		});

		return docs;
	}

	_normalizeClass( doc:ClassExportDoc ):void {
		this._normalizeContainer( doc );

		if( doc.constructorDoc )
			this._normalizeFunctionLike( doc.constructorDoc );

		if( doc.statics ) doc.statics
			.filter( isMethod )
			.forEach( this._normalizeFunctionLike, this );

		if( doc.interface ) {
			doc.interface.description = this.tsHost.getContent( doc.symbol.getDeclarations()![ 0 ]! );
		}
	}

	_normalizeInterface( doc:InterfaceExportDoc ):void {
		this._normalizeContainer( doc );
		this._normalizeInterfaceWithConstant( doc );

		if( doc.members ) doc.members
			.filter( isIndex )
			.forEach( index => {
				index.isIndex = true;
			} );
	}

	_normalizeContainer( doc:ContainerExportDoc ):void {
		if( doc.members ) doc.members
			.filter( isNotGetter )
			.filter( isMethod )
			.forEach( this._normalizeFunctionLike, this );
	}

	_normalizeFunctionLike( doc:MethodMemberDoc | FunctionExportDoc ):void {
		this._normalizeParams( doc );

		const overloads:(MethodMemberDoc | OverloadInfo)[] = doc.overloads;
		if( overloads ) overloads.forEach( this._normalizeParams, this );
	}

	// TODO: Check if remove in favor of `.parameterDocs`
	_normalizeParams( doc:(MethodMemberDoc | FunctionExportDoc | OverloadInfo) & Partial<JSDocMethod> ):void {
		if( !doc.parameters ) return;
		doc.params = doc.params ? doc.params : [];

		doc.parameters.forEach( parameter => {
			const [ , name, optional, type = "any" ] = parameter.match( PARAM_REGEX )!;

			let jsDocParam = doc.params!.find( param => param.name == name );
			if( !jsDocParam ) doc.params!.push( jsDocParam = { name } );

			jsDocParam.optional = !!optional;
			jsDocParam.type = type;
		} );
	}

	// TODO: Improve structure
	_normalizeInterfaceWithConstant( doc:any ) {
		// Not only an interface
		if( !(doc.symbol.flags ^ SymbolFlags.Interface) ) return;

		// Remove interface momentary
		doc.symbol.flags = doc.symbol.flags ^ SymbolFlags.Interface;

		// If it is an interface with a constant merged export:
		switch( getExportDocType( doc.symbol ) ) {
			case "const":
				let index = this.docs.indexOf( doc.constants[ 0 ] ) // get the index of the consant from full document list
				let numberOfMembers = doc.constants[ 0 ].members.length; // get the number of methods associated with that constant
				doc.constants[ 0 ].members.forEach( ( member:any ) => {this._normalizeParams( member )} ) // for each method normalize it's parameters
				this.docs.splice( index, numberOfMembers + 1 ); // remove the constant and members from the full document list
				doc.description = this.tsHost.getContent( doc.symbol.getDeclarations()![ 0 ]! ); // update interface description
				break;
			default:
				this.log.error( `Other declaration merged for ${ doc.name }` );
				break;
		}

		// Return interface flag
		doc.symbol.flags = doc.symbol.flags | SymbolFlags.Interface;
	}

}

function isMethod( doc:MemberDoc ):doc is MethodMemberDoc {
	return "parameters" in doc;
}

function isIndex( doc:MemberDoc ):doc is IndexMemberDoc {
	return doc.name === "__index";
}

function isNotGetter( doc:MemberDoc ):boolean {
	return !doc.isGetAccessor;
}
