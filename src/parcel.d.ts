// This file fixes typescript errors for parcel-bundled files that
// typescript does not know about. It does so by creating
// ambient modules (modules that do not really exist):
// https://parceljs.org/features/dependency-resolution/#typescript

// fix Parcel's environment variables
declare const process: {
  env: {
    NODE_ENV: string;
  }
}

// fix react-scan warning displayed during build:
//> @parcel/transformer-typescript-types: Cannot find name 'RenderChange'.
//> /home/jirka/ufal/doc-marker/node_modules/react-scan/dist/index.d.ts:88:21
//>   changes?: Array<RenderChange>;
//>                   ^^^^^^^^^^^^ Cannot find name 'RenderChange'.
declare type RenderChange = any;

// fix SCSS stylesheet modules
declare module "*.module.scss" {
  const value: Record<string, string>;
  export default value;
}

// fix PNG images
declare module "*.png" {
  const value: string;
  export default value;
}

// fix SVG images
declare module "*.svg" {
  const value: string;
  export default value;
}

// fix JSON files
declare module "*.json" {
  const value: Record<string, any>;
  export default value;
}
