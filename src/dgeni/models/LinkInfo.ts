import { Document } from "./Document";

export interface LinkInfo {
	url:string;
	type:string;
	valid:boolean;
	title:string;
	external:boolean;
}

export interface GetLinkInfo {
	( url:string, title:string, currentDoc:Document ):LinkInfo;
}
