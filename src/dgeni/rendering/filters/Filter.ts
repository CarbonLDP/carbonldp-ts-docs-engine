import { NunjucksThis } from "../NunjucksThis";

export interface Filter {
	name:string;
	process( this:NunjucksThis, ...params:any[] ):any;
}
