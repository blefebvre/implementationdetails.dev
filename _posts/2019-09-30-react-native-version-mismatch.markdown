---
layout: post
title: "Resolving React Native version mismatch errors"
summary: "Quick tip for getting unstuck when a RedBox `version mismatch` error is haunting your code."
twitter_image: "/images/rn-version/thumbnail.png"
date: 2019-09-30 22:34
comments: true
tags: [React native, version mismatch, upgrade]
published: true
---
There exists an especially difficult RedBox error you'll encounter which reads: `React Native version mismatch. JavaScript version: <x> Native version: <y>`. This error occurs when the JavaScript and Native bits of your app get out of sync with one another. It's critical that the RN developer tools call this out when it's detected because a version discrepancy could lead to nasty issues if the app were allowed to run. In my experience, this error almost always shows up during or immediately following an upgrade of the core React Native package.

<img src="{{ site.baseurl }}/images/rn-version/redbox.png" alt="React Native app running on a simulator with the RedBox error showing 'React Native version mismatch'" style="width: 100%; max-width: 500px" />

The React Native upgrade process has received lots of attention over the past year, and as a result has seen huge improvements in how it works. I've  written about it twice on this blog. First, a guide (which I still refer back to): [Upgrading a React Native app with rn-diff-purge](/blog/2019/03/03/upgrading-react-native-with-rn-diff-purge/), and later a walk through of a real upgrade: [React Native upgrade by example (featuring Purge Web)](/blog/2019/04/03/react-native-upgrade-by-example/). Having successfully completed a few upgrades and published posts on the subject, you may think that I have it figured out. You'd be incorrect. Occasionally I'll get stuck for hours on an upgrade issue, and the `React Native version mismatch` is one that had me stumped for longer than I'd care to admit.

This tip is for those who've rebuilt, `--reset-cache`'d, restarted, and begun pulling out their hair.

## Cleaning the project

There is a super handy tool that is linked from the _very bottom_ of the official [RN upgrade docs](https://facebook.github.io/react-native/docs/0.60/upgrading#i-have-done-all-the-changes-but-my-app-is-still-using-an-old-version) called [react-native-clean-project](https://github.com/pmadruga/react-native-clean-project). This project can be used to clean out just about everything that can be cached and potentially be the cause of your version mismatch.

Install it as a dev dependency with the following command:

    npm install --save-dev react-native-clean-project

Once installed, you can initiate a clean via the react-native CLI like so:

    react-native clean-project-auto

The tool can be tweaked with a number of flags that are detailed in the [README](https://github.com/pmadruga/react-native-clean-project#content) for additional cleaning steps, or to prevent some of the defaults.

## After cleaning

Once your project is clean, you will need to reinstall your JS dependencies as well as any CocoaPods (if your project uses them):

    npm install
    pushd ios/
    pod install
    popd

With that, go ahead and run your app in debug mode on the simulator of your choice. On my current app, this involves opening Xcode and hitting the Play button.

And with that, the app is running and I'm back in business.

<img src="{{ site.baseurl }}/images/rn-version/resolved.png" alt="React Native SQLite demo app running on a simulator successfully" style="width: 100%; max-width: 500px" />

Thanks to Github user [Pedro Madruga](https://github.com/pmadruga) for this handy tool!