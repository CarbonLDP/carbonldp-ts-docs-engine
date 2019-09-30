import marked, { MarkedOptions, Renderer } from "marked";
import { highlight } from "./utils/highlight";

marked.setOptions( {
	langPrefix: "language-",
	highlight,
} );


type PrivateRenderer = Renderer & {
	options:MarkedOptions
};

// Extends code rendering
marked.Renderer.prototype.code = function( this:PrivateRenderer, code, lang ):string {
	const codeHTML:string = this.options.highlight!( code, lang );
	const className:string = `${ this.options.langPrefix }${ lang || "*" }`;
	return `<div class="highlight-darcula"><pre class="${ className }"><code>${ codeHTML }</code></pre></div>`;
};