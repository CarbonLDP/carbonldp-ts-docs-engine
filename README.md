# Carbon LDP TS Docs Engine

[![npm version][npm-image]][npm-url]


Official Typescript Docs Engine for Carbon LDP Projects. Automatically generates documentation from [TSDoc](https://github.com/microsoft/tsdoc).

## Installation

	npm install carbonldp-ts-docs-engine

## Usage

```typescript
import DocsEngine from "carbonldp-ts-docs-engine";

const options:DocsEngine.Options = {
			src: SOURCE_DIRECTORY,
			out: OUTPUT_DIRECTORY,
			mode: ENVIRONMENT, 				// Optional, "production" | "development"
			logLevel: "info", 				// Optional
			descriptionTemplate: TEMPLATE, 	// Optional, must be nunjucks file
			npmName: NPM_REPOSITORY_NAME,	// Optional
			name: PROYECT_NAME,				// Optional
			mainClass: MAIN_CLASS_NAME,		// Optional
};

DocsEngine.generate(options);

```

## Developer Documentation

This package configures [Dgeni] to generate CabonLDP Projects' documentation based on common practices. We recommend you to start your understanding of the package by reading the main [file](../src/dgeni/index.ts).

### Notes

- From the [Dgeni] documentation:<br>
	> Dgeni on its own doesn't do much. You must configure it with Packages that contain Services and Processors. It is the Processors that actually convert your source files to documentation files.
	
	In short, [Dgeni] is just a framework with an ecosystem of packages tailored to help with the generation of 
	documentation from different sources (primarily JSDoc/TSDoc comments).

### File structure

```
├── .circleci                           	# CircleCI's configuration files (automated build and deploy system)
├── .idea    	                            # WebStorm shared configuration files (like code style)
├── config                              	# Configuration files used while bundling the application
│   ├── webpack.common.js               	# Webpack's settings used by every mode
│   ├── webpack.dev.js                 		# Webpack bundling settings for DEVELOPMENT mode
│   └── webpack.prod.js                 	# Webpack bundling settings for PRODUCTION mode
├── dist                                    # Distribution files created after build process
├── node_modules                            # npm dependencies (don't touch them) 
├── semantic-ui                             # Distribution files for Semantic-UI's build process
├── src		                                # All source files
│   ├── assets       	                  	# Assets used for the project (images, scripts, stylesheets, etc)
│   ├── dgeni       	                  	# All dgeni configuration files
│	│   ├── inline-tags-def					# Definitions of inline tags
│	│   ├── models 							# Interfaces for typescript typing dgeni objects
│	│   ├── processors 						# Custom processors to adapt dgeni into carbon's practices
│	│   ├── rendering						# Rendiring helpers
│	│   └── index.ts    					# Configuration and factories of dgeni 
│   ├── semantic-ui    	                  	# Semantic-UI styles
│   ├── templates      	                  	# Nunjucks templates to be rendered
│   └── index.ts 		                   	# Main file of the project
├── .gitignore                          	# Ignore file for git
├── CHANGELOG.md                        	# File to track package changes
├── LICENSE                             	# Self explanatory
├── package-lock.json                   	# npm's with the exact desired dependency tree
├── package.json                            # npm's configuration file
├── README.md                               # this
├── semantic.json                           # Semantic-UI configuration file
├── tsconfig.json                       	# Typescript compiler configuration file
└── webpack.config.js                   	# Webpack configuration used to bundle the Docs Engine

```

### Testing changes

Once changes have been made, you must first build and pack the project.

	npm run-script build && npm pack
	
This will generate a .tgz file, which can be used to install the Docs Engine from a separate project

	npm install /path/to/the/file.tgz

[Dgeni]: https://github.com/angular/dgeni
[Dgeni packages]: https://github.com/angular/dgeni#packages
[npm-image]: https://img.shields.io/npm/v/carbonldp-ts-docs-engine?style=flat-square
[npm-url]: https://www.npmjs.com/package/carbonldp-ts-docs-engine

---

## License

	Copyright (c) 2015-present, Base22 Technology Group, LLC
	All rights reserved.

	This source code is licensed under the BSD-style license found in the
	LICENSE file in the root directory of this source tree.