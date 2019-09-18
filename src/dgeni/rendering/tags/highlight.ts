import { GetLinkInfo } from "../../models/LinkInfo";
import { NunjucksThis } from "../NunjucksThis";
import { highlight } from "../utils/highlight";
import { linkify } from "../utils/linkify";
import { Tag } from "./Tag";


export function highlightTag( getLinkInfo:GetLinkInfo ) {
	return new Highlight( getLinkInfo );
}

export class Highlight implements Tag {
	tags = [ "highlight" ];

	constructor( private getLinkInfo:GetLinkInfo ) {}

	parse( parser:any, nodes:any ):any {
		const tok = parser.nextToken();
		const args = parser.parseSignature( null, true );
		parser.advanceAfterBlockEnd( tok.value );

		const content = parser.parseUntilBlocks( "endhighlight" );
		const tag = new nodes.CallExtension( this, "process", args, [ content ] );
		parser.advanceAfterBlockEnd();

		return tag;
	}

	process( context:NunjucksThis, content:() => string ):string;
	process( context:NunjucksThis, lang:string, content:() => string ):string;
	process( context:NunjucksThis, langOrContent:string | (() => string), content?:() => string ):string {
		const lang:string = typeof langOrContent === "string"
			? langOrContent : undefined!;
		const contentString:string = typeof langOrContent === "function"
			? langOrContent() : content!();

		const highlighted = highlight( contentString.trim(), lang );
		return linkify( highlighted, this.getLinkInfo, context.ctx.doc, false );
	}
}
