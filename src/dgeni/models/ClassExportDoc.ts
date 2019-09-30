import { ClassExportDoc } from "dgeni-packages/typescript/api-doc-types/ClassExportDoc";
import { InterfaceExportDoc } from "dgeni-packages/typescript/api-doc-types/InterfaceExportDoc";
import { ParameterDoc } from "dgeni-packages/typescript/api-doc-types/ParameterDoc";


declare module "dgeni-packages/typescript/api-doc-types/ClassExportDoc" {
	interface ClassExportDoc {
		interface?:InterfaceExportDoc & ParameterDoc;
	}
}
