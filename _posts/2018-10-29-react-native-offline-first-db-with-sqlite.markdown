---
layout: post
title: "Building an offline first app with React Native and SQLite"
date: 2018-10-12 22:34
comments: true
tags: [React Native, SQLite, TypeScript, CocoaPods, mobile, apps]
published: false
---
This article will get you started with an offline first, Promise based, device-local SQLite database in a React Native app. As I mentioned in the intro of [my last post](/blog/2018/10/12/react-native-typescript-cocoapods/), I recently worked on a side project which required the storage of financial data in a relational manner. Due to the sensitive nature of the data, we did not wish to store it on a server. The solution we came up with was one where the data would be stored locally on-device, which we found to have a number of benefits:

- There would be no server for us to manage, patch, keep online, and serve as a single point of failure for the app
- There would be no server-side code to develop, debug, load test, and monitor
- The app would work offline out-of-the-box, since this would be the primary use case
- If our users' wished to sync their data with another device, the app could be integrated with a service like Dropbox (a pattern we'd seen work well in other apps, such as [1Password](https://1password.com/))

We were sold on the approach, and I began looking into options for storing relational data device-side with minimal overhead. SQLite quickly became the natural choice: it's fast, rock solid, and has been battle tested for years across a huge array of platforms and devices. 


