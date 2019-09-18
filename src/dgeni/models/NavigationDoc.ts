import { ExportDoc } from "dgeni-packages/typescript/api-doc-types/ExportDoc";


export interface NavigationDoc {
	id:string;
	name:string;
	type:string;
	exports:ExportDoc[];
}
