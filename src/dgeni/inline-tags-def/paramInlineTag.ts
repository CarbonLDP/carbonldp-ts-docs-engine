import { Document } from "dgeni";
import { InlineTagDef } from "./InlineTagDef";

export function paramInLineTag():InlineTagDef {
	return {
		name: "param",
		description: "Process inline param tags (of the form {@param parameter}), replacing them with the parameter description",
		handler: function( doc:Document, tagName:string, tagDescription:string ) {
			return `${ tagDescription }`
		}
	}
}
