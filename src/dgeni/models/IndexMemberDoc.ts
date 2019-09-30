import { MethodMemberDoc } from "dgeni-packages/typescript/api-doc-types/MethodMemberDoc";

export interface IndexMemberDoc extends MethodMemberDoc {
	isIndex?:boolean;
}