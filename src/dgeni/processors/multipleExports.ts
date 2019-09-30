import { DocCollection, Processor } from "dgeni";
import { ConstExportDoc } from "dgeni-packages/typescript/api-doc-types/ConstExportDoc";
import { InterfaceExportDoc } from "dgeni-packages/typescript/api-doc-types/InterfaceExportDoc";
import { MethodMemberDoc } from "dgeni-packages/typescript/api-doc-types/MethodMemberDoc";
import { Host } from "dgeni-packages/typescript/services/ts-host/host";
import { getExportDocType } from "dgeni-packages/typescript/services/TsParser";
import { SymbolFlags } from "typescript";
import { Logger } from "winston";
import { Document } from "../models/Document";


export function multipleExports( tsHost:Host, log:Logger ):MultipleExports {
	return new MultipleExports( tsHost, log );
}

interface ConstantExport extends ConstExportDoc {
	members?:MethodMemberDoc[];
}

export class MultipleExports implements Processor {

	$runBefore = [ "parsing-tags" ];
	docs!:DocCollection;

	private readonly tsHost:Host;
	private readonly log:Logger;

	constructor( tsHost:Host, log:Logger ) {
		this.$runBefore = [ "parsing-tags" ];

		this.tsHost = tsHost;
		this.log = log;

	}

	$process( docs:Document[] ) {
		this.docs = docs;

		docs.forEach( doc => {
			switch( doc.docType ) {
				case "class":
					this._ensureClassAndInterface( doc );
					break;

				case "interface":
					this._ensureInterfaceAndConstant( doc );
					break;
			}
		} );

		return this.docs;
	}


	// TODO: Improve structure
	_ensureInterfaceAndConstant( doc:any ) {
		// Not only an interface
		if( !(doc.symbol.flags ^ SymbolFlags.Interface) ) return;

		// Remove interface momentary
		doc.symbol.flags = doc.symbol.flags ^ SymbolFlags.Interface;

		switch( getExportDocType( doc.symbol ) ) {
			// If it is an interface with a constant merged export:
			case "const":
				let exportDoc:ConstantExport = new ConstExportDoc( this.tsHost, doc.moduleDoc, doc.symbol ); //Create constant document
				doc.constants = [ exportDoc ]; // Add the constant's document to the Interface Document as a reference
				exportDoc.members = []; // Array for possible methods within the constant
				try {
					let members = doc.constants[ 0 ].declaration.type.members; //If the constant has a description, it will be stored here.
					this.docs.push( exportDoc );
					members.forEach( ( member:any ) => {
						// Create method document and push it to both the constant document as well as the full document's list.
						let methodDoc:MethodMemberDoc = new MethodMemberDoc( this.tsHost, doc, member.symbol, member );
						exportDoc.members!.push( methodDoc );
						this.docs.push( methodDoc );
					} )
				} catch {
					// If the constant doesn't have a description, it will be stored here.
					let container = doc.constants[ 0 ].variableDeclaration.initializer.nextContainer;
					// Create method document and push it to both the constant document as well as the full document's list.
					let methodDoc:MethodMemberDoc = new MethodMemberDoc( this.tsHost, doc, container.symbol, container );
					exportDoc.members.push( methodDoc );
					this.docs.push( exportDoc );
					this.docs.push( methodDoc );
				}
				break;

			default:
				this.log.error( `Other declaration merged for ${ doc.name }` );
				break;
		}

		// Return interface flag
		doc.symbol.flags = doc.symbol.flags | SymbolFlags.Interface;
	}

	// TODO: Improve structure
	_ensureClassAndInterface( doc:any ) {
		// If it is just a class return
		if( !(doc.symbol.flags ^ SymbolFlags.Class) ) return;

		// Remove class flag temporarily
		doc.symbol.flags = doc.symbol.flags ^ SymbolFlags.Class;

		switch( getExportDocType( doc.symbol ) ) {
			case "interface":
				let host:Host = new Host();
				let exportDoc:InterfaceExportDoc = new InterfaceExportDoc( host, doc.moduleDoc, doc.symbol ); // Create Interface export document
				doc.interface = exportDoc; // Keep a reference to the interface inside the class document
				break;
			default:
				this.log.error( `Other declaration merged for ${ doc.name }` );
				break;
		}

		// Return class flag
		doc.symbol.flags = doc.symbol.flags | SymbolFlags.Class;
	}

}

