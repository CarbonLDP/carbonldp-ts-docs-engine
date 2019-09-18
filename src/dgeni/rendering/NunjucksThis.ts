import { Document } from "../models/Document";

export interface NunjucksThis {
	ctx:{
		doc:Document
	};
}