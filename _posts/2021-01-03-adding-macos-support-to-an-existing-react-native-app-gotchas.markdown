---
layout: post
title: "Adding macOS support to an existing React Native app"
summary: "Microsoft recently introduced a package to enable React Native apps to be built and run on macOS. This post covers some gotchas that I encountered while adding support to an existing app."
twitter_image: "/images/...."
date: 2021-01-03 6:24
comments: true
tags: [React Native, macOS, SQLite, gotchas]
published: true
---
I first learned about the [React Native for macOS](https://github.com/microsoft/react-native-macos) project while investigating a claim I'd heard that _any iOS app_ could now run natively on Big Sur. Turns out I had heard wrong; iOS apps [can run natively on Big Sur](https://developer.apple.com/documentation/macos-release-notes/macos-big-sur-11_0_1-ios-ipados-apps-on-mac-release-notes), but only on Macs with the new Apple silicon (M1 chip).

Fortunately, the folks at Microsoft had been hard at work on [React Native for Windows + macOS](https://microsoft.github.io/react-native-windows/docs/rnm-getting-started) which claims to enable you to run your React Native apps on macOS 10.13 (High Sierra) and greater. I have an app which has no mobile-specific requirements and a user base that would value being able to work on both iOS and Mac, so I decided to try it out.

This post details some of the gotchas I ran into while adding macOS support to an existing React Native app.

# Before you begin

I'd highly recommend giving the [Get Started with macOS - 0.62](https://microsoft.github.io/react-native-windows/docs/0.62/rnm-getting-started) doc a read from top to bottom before attempting to add support to an existing app. It is short and sweet, and in a perfect world will give you a working macOS app in about 5 minutes. Worst case, you'll find out which dev dependencies you are missing and can get things sorted before beginning the process on your app.

Next, ensure your existing app has been upgraded to React Native `0.62.2` (the latest 0.62 release). At the time of writing the latest release of RN is 0.63, but the "Get Started with macOS" states the following: "** Latest stable version available for React Native for macOS is 0.62**"

Are you a few versions behind? The [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) is an excellent tool for working through an upgrade. I've done a few of these now, and have my process documented here: [Upgrading a React Native app](/blog/2019/03/03/upgrading-react-native-with-rn-diff-purge/)

# Install

The actual installation is dead simple and was finished in a few minutes. I won't duplicate the steps here since they are very nicely laid out in [Get Started with macOS - 0.62](https://microsoft.github.io/react-native-windows/docs/0.62/rnm-getting-started) guide. 

Hopefully this part goes smoothly for you as well, but if not I'd recommend perusing the [react-native-macos GitHub repo issues tab](https://github.com/microsoft/react-native-macos/issues?q=is%3Aissue+) to see if there's a workaround for your problem.

Upon reaching the bottom of the "Get Started with macOS" guide you should have a shiny new `macos/` directly next to `ios/` and/or `android/` in your project root. Open your new `macos/*.xcworkspace` file with Xcode, select the `*-macOS` build target, and hit the play button to build and run your app.

<img src="{{ site.baseurl }}/images/react-native/macos/macOS-build-target.png" alt="Selecting the macOS build target in Xcode" >

# Gotchas

Did your app open up, work perfectly, and not display any redbox errors? If so, I offer my sincere congratulations. You may close this browser tab now and begin the App Store release process for your new macOS app (after a thorough round of testing, of course 🙂).

If not, however, perhaps I can help by sharing the solutions to issues that I ran into.

## Invariant Violation: `Native module cannot be null`


<img src="{{ site.baseurl }}/images/react-native/macos/invariant-violation.png" alt="Redbox error stating 'Invariant Violation: Native module cannot be null' (detailed in text form below)" width="350" >

This was a frustrating one to debug. Which module are we talking about, here?

```
Invariant Violation: Native module cannot be null.

invariant
    index.bundle?platform=macos&dev=true&minify=false:1817:25
NativeEventEmitter
    index.bundle?platform=macos&dev=true&minify=false:34486:19
<unknown>
    FS.common.bundle?platform=macos&dev=true&minify=false&modulesOnly=true&runModule=false&shallow=true:14:54
loadModuleImplementation
    index.bundle?platform=macos&dev=true&minify=false:271:13
<unknown>
    DropboxDatabaseSync.bundle?platform=macos&dev=true&minify=false&modulesOnly=true&runModule=false&shallow=true:17:57
loadModuleImplementation
```

### If you come across this error

My understanding of this error is that there is some JS code which is attempting to use a native module which does not exist in the compiled app, for whatever reason. Therefor the first step in resolving this error is understanding which native module is failing to run on macOS.

There is a clue in the fine print of this stacktrace which I would not find until after my debugging and extensive Googling: starting at the top, look for the first line of fine print which involves a JS file from your app. In my apps case, [DropboxDatabaseSync](https://github.com/blefebvre/react-native-sqlite-demo/blob/main/src/sync/dropbox/DropboxDatabaseSync.ts) is this file.

Next, open the file in question. If you aren't using source control now might be a good time to start, since I am going to suggest deleting source which you will _most likely_ want to add back at some point. At the very least, take a complete backup of your app before making any changes.

Now it's time to remove imports for any native modules that this file includes, and comment out (or delete) the code which is using the imported module. In my case this involved commenting out 

<!-- LEFT OFF HERE! -->

### Solution/workaround

## `Modal` support

```
Invariant Violation: requireNativeComponent: "RCTModalHostView" was not found in the UIManager.

This error is located at:
    in RCTModalHostView (at Modal.js:262)
    in Modal (at ViewListModal.tsx:64)
    in ViewListModal (at AllLists.tsx:62)
    in RCTView (at AllLists.tsx:37)
    in AllLists (at HomeScreen.tsx:14)
```

## Dropbox OAuth2 support (?)

# Unknowns

- Is the macOS project's iOS XCode target the one which should be used (instead of the previous ios project)?
