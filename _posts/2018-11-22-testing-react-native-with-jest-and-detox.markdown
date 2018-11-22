---
layout: post
title: "Testing React Native apps with Jest and Detox"
date: 2018-11-22 7:32
comments: true
tags: [React Native, Testing, TypeScript, Jest, mobile, apps]
published: false
---
Outline: 

1. want to write our tests using typescript, so we have to do a few things
- from RNs Jest example on GitHub, replace "jest" prop in package.json with:

  "jest": {
    "preset": "react-native",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "globals": {
      "ts-jest": {
        "tsConfig": "tsconfig.jest.json"
      }
    },
    "testMatch": [
      "**/__tests__/*.+(ts|tsx|js)"
    ]
  }

- install ts-jest package as a dev dep, and babel-core@bridge (v7)

  npm install --save-dev ts-jest babel-core@bridge

- rename .babelrc to babel.config.js, and replace it's contents with

  module.exports = {
    presets: ["module:metro-react-native-babel-preset"]
  };

- why is this needed? there's an open issue with Metro: https://github.com/facebook/metro/issues/242#issuecomment-431350665

2. A keen eye will note above that we're not pointing at our existing tsconfig.json file. Jest seems to prefer commonjs modules, so we'll need to extend our existing tsconfig file by creating a file named `tsconfig.jest.json` with the following contents:

  {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "jsx": "react",
      "module": "commonjs"
    }
  }


2. Create a top level `__tests__` directory in your project

3. Add a test! For example, create `CheckboxTest.tsx` in `__tests__`:

  import React from "react";
  import renderer from "react-test-renderer";

  import { Checkbox } from "../src/components/Checkbox";

  test("Renders correctly unchecked", () => {
    const tree = renderer.create(<Checkbox checked={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Renders correctly checked", () => {
    const tree = renderer.create(<Checkbox checked={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

