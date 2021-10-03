<p align="center">
  <h1 align="center">directus-extension<br />generate-types</h1>
  <h4 align="center">Create types for your directus project in your favourite language.</h4>
</p>

![Screenshot_20211003_182220](https://user-images.githubusercontent.com/48161361/135762817-2b620041-5994-47c9-875e-5ca31d8293cc.png)


### Currently supports

- TypeScript
- Python Type Hints
- OpenAPI Specification
- More soon

## How to install

1. Download the latest `index.js` from the [GitHub releases page](https://github.com/maltejur/directus-extension-generate-types/releases).
2. Put this `index.js` file into `<root of your project>/extensions/modules/generate-types/index.js`
3. Go into the `Project Settings` of your directus project (`/admin/settings/project`) and enable the `Generate Types` module at the bottom of the page.

## Contribute

Since I don't know all of the typing systems out there, I would greatly appreciate if you
would let me know how types for a language you know should look like, or even implement 
the generation of types for that language yourself.

If you find an error or think somthing in the process of generating types for the current
languages is done in a dumb way, feel free to also open an issue.
