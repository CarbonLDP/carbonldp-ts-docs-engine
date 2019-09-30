import { Filter } from "./Filter";

export function nullifyEmptyFilter():Filter {
	return {
		name: "nullifyEmpty",
		process( array:unknown[] ):unknown[] | null {
			if( !array ) return null;

			array = array.filter( x => x );
			if( array.length === 0 ) return null;

			return array;
		},
	};
}
