import { BaseApiDoc } from "dgeni-packages/typescript/api-doc-types/ApiDoc";
import { NavigationDoc } from "./NavigationDoc";


declare module "dgeni-packages/typescript/api-doc-types/ApiDoc" {
	interface BaseApiDoc {
		navigationDocs:NavigationDoc[];
	}
}
