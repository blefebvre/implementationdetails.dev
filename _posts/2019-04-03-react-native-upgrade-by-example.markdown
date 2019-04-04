---
layout: post
title: "React Native upgrade by example (featuring Purge Web)"
date: 2019-04-03 23:11
comments: true
tags: [React Native, TypeScript, upgrade, mobile, apps]
published: true
---
Shortly after I published my [previous post](/blog/2019/03/03/upgrading-react-native-with-rn-diff-purge/) on upgrading React Native, the owner and maintainer of the [rn-diff-purge](https://github.com/react-native-community/rn-diff-purge) repo, [Pavlos Vinieratos](https://github.com/pvinis), kindly reached out to let me know that some changes were in the works for the way upgrade was going to work going forward. I had an upgrade that I had been planning to do and thought I would give the updated approach a try. This post is a summary of my experience upgrading an RN app from `0.55.4` all the way to the state-of-the-art (at the time of writing): `0.59.2`. 

The plans for improving upgrade that Pavlos shared with me are twofold. First, a web UI will be released to enable easier access to the diffs. This piece is now complete and is linked to from the original home of the [rn-diff-purge](https://github.com/pvinis/rn-diff-purge) repo: [pvinis.github.io/purge-web](https://pvinis.github.io/purge-web)

Next, the current git-upgrade method of performing upgrades with the React Native CLI will be replaced by the purge approach. This is in the works now, and is expected to land in `0.60.*`.


## The challenge

I had successfully upgraded my open source [react-native-sqlite-demo](https://github.com/blefebvre/react-native-sqlite-demo) app, but my side project app that is currently deployed in the Apple App Store had still yet to be done - and was even further behind. 

My task was therefor to upgrade a production app from `0.55.4` to the current latest release. At Pavlos' suggestion, I planned to break from my previous recommendation of working through each upgrade one at a time (even skipping RCs, this would have been 21 individual upgrades 😬), and perform the upgrade in 4 steps (minor release numbers only). This sounded much more manageable. With the new [Purge Web](https://pvinis.github.io/purge-web) page ready, I began.

<img src="{{ site.baseurl }}/images/react-native/upgrade-2/purge-web.png" alt="The Purge Web home page" />

The Purge Web UI is about as simple as it can be: instead of scrolling through a large upgrade matrix of `from version` and `to version` cells, you select the version you are beginning with and the version you are upgrading to, and then click `Diff here`. This link takes you to the familiar GitHub compare UI which details all the changes that you need to apply in order to reach your selected `To:` version.


## 0.55.4 to 0.56.1

> Showing 19 changed files with 60 additions and 90 deletions.

Not bad. I went ahead and made the changes, ignoring the Flow related changes since I am a TypeScript user instead.

Uho - upon restarting the Metro bundler I received a nasty looking error in the console:

<img src="{{ site.baseurl }}/images/react-native/upgrade-2/trailing-comma-after-rest2.png" alt="Metro error showing 'A trailing comma is not permitted after the rest element'" />

A quick search on the module in questions' GitHub repo brought me to the following issue: [react-native-popup-menu/issues/111](https://github.com/instea/react-native-popup-menu/issues/111).

Looks like the issue was fixed in 0.13.2! Not wanting to risk a breaking change at this point, I went ahead and grabbed the latest 0.13 release:

    npm install react-native-popup-menu@0.13.3

With a restart of the Metro bundler I was back in business! All [Detox](https://github.com/wix/Detox) end-to-end tests passed, so it was on to the next one.


## 0.56.1 to 0.57.8

> Showing 16 changed files with 117 additions and 81 deletions.

Another reasonable set of changes, considering I was jumping ahead 14 releases at once.

After applying the changes, the app built successfully and all my tests passed! At this point I happened to also submit a new build to Apple's Testflight service, and received an interesting email upon doing so detailing a "Missing Purpose String":

<img src="{{ site.baseurl }}/images/react-native/upgrade-2/missing-purpose-string.png" alt="Message from Apple indicating that I need to provide a reason why my app uses the location Always - but it doesn't!" />

What?! My app does not use location at all, nevermind _always_!

It turns out that even though my app does not use the location APIs in JS, I had to remove the native `RCTGeolocation.xcodeproj` from Xcode as described in [this comment](https://github.com/facebook/react-native/issues/20879#issuecomment-417697117) in order to satisfy Apple. This is a fair request, and as an app user I'm pleased to see that they are scanning the code for sensitive API use like this.


## 0.57.8 to 0.58.6

> Showing 18 changed files with 75 additions and 44 deletions.

The only hiccup with this step was that I ran into the odd `Error: Cannot find module './bundle/unbundle'` issue that I hit [during my last upgrade](/blog/2019/03/03/upgrading-react-native-with-rn-diff-purge/#bundleunbundle-) as well. Removing `node_modules/` and restarting the bundler worked like a charm 👍.

Unfortunately for me, this time there was a test failure. It appeared to be related to my user's preferences not being initialized correctly. In short, the app is supposed to take a guess at the user's home currency, based on their locale. This was not occurring, and the app was left in a state where it did not know which currency to use:

<img src="{{ site.baseurl }}/images/react-native/upgrade-2/preferred-currency.png" alt="Screenshot of the app which could not figure out which home currency to use" />

Debugging further led me to discover that the app was figuring out the user's currency just fine, but when it wrote the currency index to the DB (0 for USD, 1 for CAD, etc.), it was writing `1.0` (instead of `1`). When my code later read this value and attempted to use it to figure out the name of the home currency, it was failing. `1.0` is not a valid array index, after all! 

With a small code change to fix this bug I was back in business. I am admittedly still stumped as to what change in React Native would have caused the DB to write a float instead of an integer...


## 0.58.6 to 0.59.2 - final step!

> Showing 14 changed files with 69 additions and 39 deletions.

I applied the changes and... my Detox end-to-end test cases failed to interact with a key element in the UI! Unfortunately for me, I seem to have been too quick to adopt the 0.59.* release, as the Detox README clearly states that they only support `<=0.58` (and `<=0.56` on Android).

Despite the offending UI element working fine when run outside of e2e tests, I did not want to proceed without my test suite working. I decided to park the `0.59.2` changes in a branch for later, and return back to my last commit on the `0.58.6` release for now. 


## Conclusion

The [Purge Web](https://pvinis.github.io/purge-web) page was a joy to use! I almost made it to my goal of version `0.59.2`, but it was no fault of the upgrade tools that I stopped short.

I would like to thank [Pavlos](https://twitter.com/pvinis) for all his effort on making upgrading React Native apps easier, and for all the advice he shared with me on the subject - thank you 🍻! 

Lastly, keep an eye out for the `0.60.*` release. With any luck, upgrading our apps is only going to get easier.
