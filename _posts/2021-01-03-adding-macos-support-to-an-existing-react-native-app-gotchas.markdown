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
<!--

<img src="{{ site.baseurl }}/images/aem/sling/intellij_breakpoint.png" alt="IntelliJ state when a breakpoint is hit" >

-->
# Before you begin

# Setup

# Gotchas

## Invariant Violation: `Native module cannot be null`

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
