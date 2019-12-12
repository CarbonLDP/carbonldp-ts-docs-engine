## Developer Documentation

This package configures [Dgeni] to generate CabonLDP Projects' documentation based on common practices. We recommend you to start your understanding of the package by reading the main [file](../src/dgeni/index.ts).

### Notes

- From the [Dgeni] documentation:<br>
	> Dgeni on its own doesn't do much. You must configure it with Packages that contain Services and Processors. It is the Processors that actually convert your source files to documentation files.
	
	In short, [Dgeni] is just a framework with an ecosystem of packages tailored to help with the generation of 
	documentation from different sources (primarily JSDoc/TSDoc comments).

### File structure

```
├── .circleci                               # CircleCI's configuration files (automated build and deploy system)
├── .idea                                   # WebStorm shared configuration files (like code style)
├── config                                  # Configuration files used while bundling the application
│   ├── webpack.common.js                   # Webpack's settings used by every mode
│   ├── webpack.dev.js                      # Webpack bundling settings for DEVELOPMENT mode
│   └── webpack.prod.js                     # Webpack bundling settings for PRODUCTION mode
├── dist                                    # Distribution files created after build process
├── node_modules                            # npm dependencies (don't touch them) 
├── src                                     # All source files
│   ├── assets                              # Assets used for the project (images, scripts, stylesheets, etc)
│   ├── dgeni                               # All dgeni configuration files
│   │   ├── inline-tags-def                 # Definitions of inline tags
│   │   ├── models                          # Interfaces for typescript typing dgeni objects
│   │   ├── processors                      # Custom processors to adapt dgeni into carbon's practices
│   │   ├── rendering                       # Rendiring helpers
│   │   └── index.ts                        # Configuration and factories of dgeni 
│   ├── semantic-ui                         # Semantic-UI styles
│   ├── templates                           # Nunjucks templates to be rendered
│   └── index.ts                            # Main file of the project
├── .gitignore                              # Ignore file for git
├── CHANGELOG.md                            # File to track package changes
├── LICENSE                                 # Self explanatory
├── package-lock.json                       # npm's with the exact desired dependency tree
├── package.json                            # npm's configuration file
├── README.md                               # this
├── semantic.json                           # Semantic-UI configuration file
├── tsconfig.json                           # Typescript compiler configuration file
└── webpack.config.js                       # Webpack configuration used to add the assets into the generated HTML files for the documentation

```

### Testing changes

Once changes have been made, you must first build and pack the project.

	npm run-script build && npm pack
	
This will generate a .tgz file, which can be used to install the Docs Engine from a separate project

	npm install /path/to/the/file.tgz

[Dgeni]: https://github.com/angular/dgeni
[Dgeni packages]: https://github.com/angular/dgeni#packages

### Node modules

- `dependencies`
    - `autoprefixer`: Parses CSS and add vendor prefixes to CSS for multiple browser support
    - `css-loader`: Resolves css imports and emits a stylesheet to the output directory
    - `dgeni`: Documentation generation framework upon which this package is based on
    - `dgeni-packages`: [Dgeni packages](https://github.com/angular/dgeni#packages) offered by the Dgeni team
    - `favicons-webpack-plugin`: Webpack plugin that generates the necessary favicons
    - `file-loader`: Resolves file imports and emits the file to the output directory
    - `html-webpack-plugin`: Simplifies creation of HTML files to serve webpack bundles
    - `image-webpack-loader`: Resolves image imports and emits the image to the output directory
    - `jquery`: Added as a dependency because it is used by fomantic-ui
    - `mini-css-extract-plugin`: Creates a CSS file per JS file which contains CSS
    - `node-sass`: Library that provides binding for Node.js to LibSass
    - `optimize-css-assets-webpack-plugin`: Minimize css assets
    - `postcss-loader`: Process CSS with PostCSS
    - `prismjs`: Highlights syntax in generated documentation
    - `sass-loader`: Loads a Sass/SCSS file and compiles it to CSS
    - `tslib`: Library that contains the helper functions of TypeScript
    - `uglifyjs-webpack-plugin`: Webpack plugin that minifies JavaScript files
    - `url-loader`: A loader for webpack which transforms files into base64 URIs
    - `webpack`: Module bundler for the project
    - `webpack-merge`: provides a merge function that concatenates arrays and merges objects creating a new object
    - `winston`: Logger used in the project
- `devDependencies`
    - `@types/marked`: TypeScript definitions for marked, used by dgeni-packages
    - `@types/node`: TypeScript definitions for NodeJS
    - `@types/nunjucks`:TypeScript definitions for nunjucks, used by dgeni-packages
    - `@types/prismjs`: TypeScript definitions for PrismJS
    - `@types/webpack`: TypeScript definitions for Webpack
    - `fomantic-ui`: Community fork of the UI Framework, semantic-ui
    - `ncp`: Asynchronous recursive file & directory copying
    - `npm-run-all`: A CLI tool to run multiple npm-scripts in parallel or sequential
    - `rimraf`: The UNIX command `rm -rf` for NodeJS. Removes directories and it's files
    - `ts-node`: Executable to run TypeScript files with Node.js without the necessity to compile to JavaScript before
    - `typescript`: A JavaScript superset maintained by Microsoft that allows to write JS using types