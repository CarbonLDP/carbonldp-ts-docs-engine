import { Processor, DocCollection, } from "dgeni";
import { ModuleDoc } from "dgeni-packages/typescript/api-doc-types/ModuleDoc";
import { Document } from "../models/Document";
import { NavigationDoc } from "../models/NavigationDoc";


export function navigationProcessor():Navigation {
	return new Navigation();
}

export class Navigation implements Processor {

	static idCompare( first:{ id:string }, second:{ id:string } ):number {
		return first.id.toLowerCase().localeCompare( second.id.toLowerCase() );
	}

	$runAfter = [ "processing-docs" ];
	$runBefore = [ "docs-processed" ];

	_navigationDocs:NavigationDoc[] = [];

	$process( docs:Document[] ) {
		const filteredDocs:Document[] = docs.filter( (doc:Document) => {
			if( [ "function-overload", "get-accessor-info" ].includes( doc.docType ) ) return false;

			if( doc instanceof ModuleDoc ) {
				if( doc.fileInfo.baseName !== "index" ) return false;
				if( doc.name === "index" ) this._fixIndexModule( doc );
				this._addNavigationDoc( doc );
			} else {
				if( doc.moduleDoc === void 0 ) return false;
				if( doc.moduleDoc.fileInfo.baseName !== "index" ) return false;
			}

			doc.navigationDocs = this._navigationDocs;
			return true;
		} );

		this._navigationDocs.sort( Navigation.idCompare );

		return filteredDocs;
	}

	_fixIndexModule( doc:ModuleDoc  ):void {
		// Change document properties
		doc.docType = "index";
		doc.id = "";

		let exported:boolean = false;
		doc.exports = doc.exports.filter( exportDoc => {
			if( exportDoc.name === "default" ) return false;

			// Remove `index` from id
			exportDoc.id = exportDoc.id.substr( 6 );

			return true;
		} );
	}

	_addNavigationDoc( doc:ModuleDoc ):void {
		const exports = doc.exports || [];
		exports.sort( Navigation.idCompare );

		this._navigationDocs.push( {
			id: doc.id,
			name: doc.name,
			type: doc.docType,
			exports,
		} );
	}

}
