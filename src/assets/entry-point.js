// Semantic UI
if( process.env.NODE_ENV === "production" ) {
	require( "../../dist/semantic-ui/semantic.min" );
	require( "../../dist/semantic-ui/semantic.min.css" );
} else {
	require( "../../dist/semantic-ui/semantic" );
	require( "../../dist/semantic-ui/semantic.css" );
}

// Customs
//  js
import "./scripts/main";
//  css
import "./styles/main.scss";