import { MemberDoc } from "dgeni-packages/typescript/api-doc-types/MemberDoc";
import { NavigationDoc } from "./NavigationDoc";


declare module "dgeni-packages/typescript/api-doc-types/MemberDoc" {
	interface MemberDoc {
		navigationDocs:NavigationDoc[];
	}
}
