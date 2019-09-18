import { Document } from "../../models/Document";
import { GetLinkInfo } from "../../models/LinkInfo";
import { NunjucksThis } from "../NunjucksThis";
import { linkify } from "../utils/linkify";
import { Filter } from "./Filter";


export function linkifyFilter( getLinkInfo:GetLinkInfo ):Filter {
	return {
		name: "linkify",
		process( this:NunjucksThis, str:string, doc:Document = this.ctx.doc ):string {
			return linkify( str, getLinkInfo, doc );
		},
	};
}
