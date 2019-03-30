---
layout: post
title: "Upgrading a React Native app with rn-diff-purge"
date: 2019-03-31 21:27
comments: true
tags: [React Native, TypeScript, upgrade, mobile, apps]
published: true
---
Shortly after I published my last post on upgrading React Native, the owner of the `rn-diff-purge` repo (pvinis) kindly reached out to let me know that some changes were in the works for the way upgrade was going to work going forward. The changes he brought to my attention were:

- 

## The challenge

I had successfully upgraded my open source [react-native-sqlite-demo](https://github.com/blefebvre/react-native-sqlite-demo) app, but my app that was currently deployed in the Apple App Store had still yet to  be done. 

My task was therefor to upgrade a generally available app from 0.55.4 to the current latest release: 0.59.2 at the time of writing. I planned to break from my previous recommendation and perform the upgrade in 4 steps (minor release numbers only), at Pavlos' suggestion 


## 0.55.4 to 0.56.1

> Showing 19 changed files with 60 additions and 90 deletions.

Not bad. I went ahead and made the changes, ignoring Flow related things since I am a TypeScript user instead.

Uho - upon restarting the Metro bundler I received a nasty looking error in the console:

<!-- image goes here -->

I did a quick search on the module in questions' GitHub page and arrived at the following issue: [react-native-popup-menu/issues/111](https://github.com/instea/react-native-popup-menu/issues/111).

Looks like the issue was fixed in 0.13.2! Not wanting to risk a breaking change at this point, I went ahead and grabbed the latest 0.13 release:

    npm install react-native-popup-menu@0.13.3

With a restart of the Metro bundler I was back in business! All Detox tests are passing, so it's on to the next one.


## 0.56.1 to 0.57.8

> Showing 16 changed files with 117 additions and 81 deletions.

Another reasonable set of changes, considering I was jumping ahead 14 releases at once.

The app builds successfully and all my tests pass, but I notice that the React Native Navigation header has taken on a new, strange, horizontal stripe design:

<!-- pic of stripes -->