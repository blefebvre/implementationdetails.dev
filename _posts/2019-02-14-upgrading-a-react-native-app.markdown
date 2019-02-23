---
layout: post
title: "Upgrading a React Native app"
date: 2019-02-28 23:50
comments: true
tags: [React Native, TypeScript, upgrade, mobile, apps]
published: false
---
The React Native project is moving at a fast pace, and it can be difficult to keep up. I recently worked through the process of updating my production codebase from the 0.55.4 release to 0.58.2, and documented the process below as I went.


## Goal

I hope this article makes the update process seem less intimidating. It really isn't that hard, and I think it's important to not let your app fall too far behind the latest stable release. There's lots happening in the community and the framework seems to only be improving.


## Before you begin

Read the [Upgrading to new React Native versions](https://facebook.github.io/react-native/docs/upgrading) doc. Really. The whole thing! It's not that long, and I'm not going to duplicate their content here. Besides, my experience below only covers one type of app: a project bootstrapped with `react-native init`. Other paths exists for Expo apps that make this process even easier.

One thing the docs don't mention: please make sure you are using `git` or another source control management system before attempting an upgrade. Create a new branch where you can hack away consequence-free, and keep a `git checkout master` in your back pocket in case things go really sideways.

Also, make sure to run your entire suite of tests before beginning. There's nothing worse that rolling back a bunch of work to find out that a test was breaking beforehand on the existing "stable" codebase! In my react-native-sqlite-demo's case, this step involves running the unit tests:

    npm test

And then running the end-to-end tests:

    pushd e2e/
    npm run test:e2e
    popd

/* insert image of a clean test run HERE */

## Begin!

The action gets underway when the following command is run:

    react-native-git-upgrade