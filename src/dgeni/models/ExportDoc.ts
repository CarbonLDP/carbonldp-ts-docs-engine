import { ExportDoc } from "dgeni-packages/typescript/api-doc-types/ExportDoc";
import { NavigationDoc } from "./NavigationDoc";


declare module "dgeni-packages/typescript/api-doc-types/ExportDoc" {
	interface ExportDoc {
		isDefault:boolean;
		navigationDocs:NavigationDoc[];
	}
}
