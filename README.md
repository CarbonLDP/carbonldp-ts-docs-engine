# Carbon LDP TS Docs Engine

[![npm version][npm-image]][npm-url]
[![CircleCI][circle-ci-image]][circle-ci-url]


Official Typescript Docs Engine for Carbon LDP Projects. Automatically generates documentation from source code's comments.

## Installation

	npm install carbonldp-ts-docs-engine

## Usage

```typescript
import DocsEngine from "carbonldp-ts-docs-engine";

const options:DocsEngine.Options = {
	src: "src/",	                            // Directory from where the documentation is generated
	out: "docs/",	                            // Directory where the documentation is stored
	mode: "development",                        // Optional, mode in which the documentation is built
	logLevel: "info",                           // Optional, filter logs by different levels 
	descriptionTemplate: "path/to/template",    // Optional, must be a nunjucks file
	npmName: "carbonldp-ts-docs-engine",        // Optional, name of the npm package
	name: "CarbonLDP TS Docs Engine",           // Optional, name of the project
	mainClass: "DocsEngine",                    // Optional, name of the main class of the project
};

DocsEngine.generate(options)
	.then( () => {
		console.log("Docs generated");	
	} )
	.catch( (error) => {
		console.log("Error generating documentation");
	} )
```

---

## License

	Copyright (c) 2015-present, Base22 Technology Group, LLC
	All rights reserved.

	This source code is licensed under the BSD-style license found in the
	LICENSE file in the root directory of this source tree.
    
[npm-image]: https://img.shields.io/npm/v/carbonldp-ts-docs-engine?style=flat-square
[npm-url]: https://www.npmjs.com/package/carbonldp-ts-docs-engine
[circle-ci-image]: https://circleci.com/gh/CarbonLDP/carbonldp-ts-docs-engine.svg?style=svg
[circle-ci-url]: https://circleci.com/gh/CarbonLDP/carbonldp-ts-docs-engine