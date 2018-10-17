---
layout: post
title: "So, you want to build an app"
date: 2014-03-14 14:03
comments: true
tags: [AEM, CQ, PhoneGap, SUMMIT, AEMHub, apps]
---
You've been approached by management and given orders to begin architecting a plan to get that ever-coveted place in the app store. Your peers at the office are devoted iOS fans - aside from that one guy, still touting the battery life of his flip phone - and expect to see your work in their preferred store, and soon. However, upon reviewing mobile browser analytics from your company's site, you notice a trend: not all traffic is from mobile Safari. Hits seem to be originating from Android browsers at about half the rate of Safari, and Google's Chrome browser is not far behind. Your office may be satisfied with an iPhone app, but how will your Android customers take it?

<!-- more -->

Being a primarily web-oriented shop your developers are well versed in the finer points of building a progressively enhanced, responsive site that renders fast and legibly on devices of varying form factors, taking advantage of features present on the latest models while not leaving anyone behind (right?). They don't have Objective-C experience, and their server side Java skills will only get them so far in Android or BlackBerry native development. There's always the option of outsourcing, but it comes with a price tag - one that does not soon disappear if you plan on keeping your app healthy and relevant on the latest hardware. 

Enter PhoneGap. A [distribution of Apache Cordova](http://phonegap.com/2012/03/19/phonegap-cordova-and-what%E2%80%99s-in-a-name/), PhoneGap is a project which describes itself as enabling cross-platform app development with web technologies you know and love. It sounds promising! You read on. Turns out PhoneGap is basically a web browser, augmented with a JavaScript bridge that provides direct access to device features including the file system, camera, accelerometer, geolocation, compass, contacts, [and more](http://docs.phonegap.com/en/3.4.0/cordova_plugins_pluginapis.md.html#Plugin%20APIs). The plugin architecture is extensible, meaning any device feature that is not currently available can be implemented and added to your app, and even shared with the world if you feel so inclined. It has been around for about 5 years and [many successful apps](http://phonegap.com/app/feature/) have been produced with it.

As it stands, PhoneGap supports all the device operating systems & versions that your team plans to target. Now, if only there was a way to repurpose your brand's most valuable asset: its content. Using Adobe's [Experience Manager](http://www.adobe.com/ca/solutions/web-experience-management.html) (formerly CQ), your team has worked tirelessly to ensure the workflows and business logic are in place to support a distributed team of content authors, marketing personnel, and IT users alike. Your authors have built a solid foundation in the solution, and have embraced the agility afforded by being able to contribute on their various devices via the touch-friendly user interface. If only there was a way...

Well, there is. This spring I'm thrilled to be sharing the details of the AEM 6.0 and PhoneGap integration at both [Adobe SUMMIT](https://adobesummit.activeevents.com/2014/slc/connect/sessionDetail.ww?SESSION_ID=1211) in Salt Lake City, and [AEM Hub](http://aemhub.cognifide.com/speakers.html#Bruce-Lefebvre) - a brand new conference taking place in London. I hope you will join me. 
