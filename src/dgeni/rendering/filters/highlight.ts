import { Document } from "dgeni";
import { GetLinkInfo } from "../../models/LinkInfo";
import { NunjucksThis } from "../NunjucksThis";
import { highlight } from "../utils/highlight";
import { linkify } from "../utils/linkify";
import { Filter } from "./Filter";

export function highlightFilter( getLinkInfo:GetLinkInfo ):Filter {
	return {
		name: "highlight",
		process( this:NunjucksThis, str:string, lang:string, doc:Document = this.ctx.doc ):string {
			const highlighted = highlight( str.trim(), lang );
			return linkify( highlighted, getLinkInfo, doc, false );
		},
	};
}
