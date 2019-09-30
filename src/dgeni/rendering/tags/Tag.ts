import { Extension } from "nunjucks";
import { NunjucksThis } from "../NunjucksThis";

export interface Tag extends Extension {
	process( this:NunjucksThis, context:NunjucksThis, content:() => string ):string;
}