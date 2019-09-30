import { ModuleDoc } from "dgeni-packages/typescript/api-doc-types/ModuleDoc";
import { NavigationDoc } from "./NavigationDoc";


declare module "dgeni-packages/typescript/api-doc-types/ModuleDoc" {
	interface ModuleDoc {
		navigationDocs:NavigationDoc[];
	}
}
