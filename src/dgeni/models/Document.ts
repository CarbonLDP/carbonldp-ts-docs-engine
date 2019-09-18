import { AccessorInfoDoc } from "dgeni-packages/typescript/api-doc-types/AccessorInfoDoc";
import { ClassExportDoc } from "dgeni-packages/typescript/api-doc-types/ClassExportDoc";
import { ConstExportDoc } from "dgeni-packages/typescript/api-doc-types/ConstExportDoc";
import { EnumExportDoc } from "dgeni-packages/typescript/api-doc-types/EnumExportDoc";
import { FunctionExportDoc } from "dgeni-packages/typescript/api-doc-types/FunctionExportDoc";
import { InterfaceExportDoc } from "dgeni-packages/typescript/api-doc-types/InterfaceExportDoc";
import { MethodMemberDoc } from "dgeni-packages/typescript/api-doc-types/MethodMemberDoc";
import { ModuleDoc } from "dgeni-packages/typescript/api-doc-types/ModuleDoc";
import { OverloadInfo } from "dgeni-packages/typescript/api-doc-types/OverloadInfo";
import { ParameterDoc } from "dgeni-packages/typescript/api-doc-types/ParameterDoc";
import { PropertyMemberDoc } from "dgeni-packages/typescript/api-doc-types/PropertyMemberDoc";
import { TypeAliasExportDoc } from "dgeni-packages/typescript/api-doc-types/TypeAliasExportDoc";


export type Document =
	| AccessorInfoDoc
	| ClassExportDoc
	| ConstExportDoc
	| EnumExportDoc
	| FunctionExportDoc
	| InterfaceExportDoc
	| MethodMemberDoc
	| ModuleDoc
	| OverloadInfo
	| ParameterDoc
	| PropertyMemberDoc
	| TypeAliasExportDoc
	;

