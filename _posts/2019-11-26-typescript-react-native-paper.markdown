---
layout: post
title: "Resolving React Native Paper 'No overload matches this call' TypeScript errors"
summary: "Quick tip for getting past one of the more frustrating and cryptic TypeScript errors I've run into."
twitter_image: "/images/react-native/paper/thumbnail.png"
date: 2019-11-26 22:12
comments: true
tags: [React Native, Paper, TypeScript]
published: true
---
I've heard folks say, "write the blog post you wish that you'd found." Well, this post is for anyone searching for an answer to a cryptic TypeScript error that first reared it's head after installing the Material Design-compliant React Native UI library: [react-native-paper](https://reactnativepaper.com/).

## The error

I like to keep a terminal window open with the TypeScript compiler running in watch mode (with a `"tsc": "tsc"` npm script, this can be done with: `npm run tsc -- -w`). When I first noticed this error, I found it taking up nearly the entire window:

<img src="{{ site.baseurl }}/images/react-native/paper/ts-error.png" alt="TypeScript error shown printed to the terminal. The error text is duplicated in the code block below this image." style="width: 100%; max-width: 700px" />

The contents of the error is printed below:

```
src/ui/YPButton.tsx:24:10 - error TS2769: No overload matches this call.
  Overload 1 of 2, '(props: Pick<Pick<ViewProps & { children: ReactNode; style?: StyleProp<ViewStyle>; theme: Theme; }, "children" | "testID" | "style" | ... 48 more ... | "onTouchEndCapture"> & { ...; } & { ...; } & { ...; }, "children" | ... 61 more ... | "contentStyle"> & { ...; }, context?: any): ReactElement<...> | Component<...>', gave the following error.
    Type '{ children: ReactNode; styleName?: string; style?: any; onPress: () => void; mode: "text" | "outlined" | "contained"; uppercase: boolean; nativeID: string; }' is missing the following properties from type 'Pick<Pick<ViewProps & { children: ReactNode; style?: StyleProp<ViewStyle>; theme: Theme; }, "children" | "testID" | "style" | "onLayout" | ... 47 more ... | "onTouchEndCapture"> & { ...; } & { ...; } & { ...; }, "children" | ... 61 more ... | "contentStyle">': isTVSelectable, hasTVPreferredFocus, tvParallaxProperties, tvParallaxShiftDistanceX, and 3 more.
  Overload 2 of 2, '(props: Pick<Pick<ViewProps & { children: ReactNode; style?: StyleProp<ViewStyle>; theme: Theme; }, "children" | "testID" | "style" | ... 48 more ... | "onTouchEndCapture"> & { ...; } & { ...; } & { ...; }, "children" | ... 61 more ... | "contentStyle"> & { ...; } & { ...; }, context?: any): ReactElement<...> | Component<...>', gave the following error.
    Type '{ children: ReactNode; styleName?: string; style?: any; onPress: () => void; mode: "text" | "outlined" | "contained"; uppercase: boolean; nativeID: string; }' is missing the following properties from type 'Pick<Pick<ViewProps & { children: ReactNode; style?: StyleProp<ViewStyle>; theme: Theme; }, "children" | "testID" | "style" | "onLayout" | ... 47 more ... | "onTouchEndCapture"> & { ...; } & { ...; } & { ...; }, "children" | ... 61 more ... | "contentStyle">': isTVSelectable, hasTVPreferredFocus, tvParallaxProperties, tvParallaxShiftDistanceX, and 3 more.

24         <Button onPress={onPress} mode={mode} uppercase={uppercase} nativeID={testID} {...otherProps}>
```

My initial instinct was to begin adding the props that it had called me out for omitting (following `is missing the following properties from type` in the error). However, these `TV` related props weren't listed as mandatory in the Paper docs, so why do I have to include them? Besides, it's very unlikely this app will ever run on a TV.

Also concerning to me was the cryptic looking Prop type:

```
Pick<Pick<ViewProps & { children: ReactNode; style?: StyleProp<ViewStyle>...
```

Did I really want to invest in a library that was using such complex types for one of their most simple components? 😬

I turned to the source, and found that the Paper TypeScript [Props for their Button](https://github.com/callstack/react-native-paper/blob/master/src/components/Button.tsx#L22) component were in fact fine; concise and well-documented. If this wasn't an issue with Paper, and it wasn't occurring before I began using the library, what could be the culprit?

## The solution: @types/react-native@0.57.65

On a hunch, and running out of other things to try, I noticed that my installed version of `@types/react-native` (0.57.7) was quite a bit behind the latest patch release of the 0.57.* versions. I took a look at the released versions [on npm](https://www.npmjs.com/package/@types/react-native) and found that the latest available release for 0.57 was `0.57.65`. I installed it with the following command:

```
npm i @types/react-native@0.57.65 --save-dev
```

... once 👆 was installed and I'd started back up my TypeScript watch command, I was _very_ relieved to finally see that familiar, comforting compiler output again: `Found 0 errors. Watching for file changes.`

Hopefully this tip can save you a few gray hairs. 

