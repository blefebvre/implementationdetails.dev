---
layout: post
title: "AEM Apps Starter Kit improvements"
date: 2015-06-18 11:29
comments: true
tags: [AEM, CQ, Apps, PhoneGap, Starter Kit, AEM Apps, mobile]
---
With [AEM 6.1 out the door](https://docs.adobe.com/docs/en/aem/6-1/release-notes.html), we've pushed some commits to the [Starter Kit repository](https://github.com/Adobe-Marketing-Cloud-Apps/aem-phonegap-starter-kit) to ensure that the apps you bootstrap with it are taking advantage of the present state of the art. What follows is a visual tour of a few of those improvements.


### Native Page Transitions

![App showcasing native transitions]({{ site.baseurl }}/images/starter-kit-improvements/transitions.gif)

Transitions between pages play such a big role in how your app's performance is perceived, yet perfecting this animation with CSS can stump even the sharpest front-end dev. The Starter Kit now comes with the excellent [Native Page Transitions](https://github.com/Telerik-Verified-Plugins/NativePageTransitions) plugin enabled by default, delivering buttery smooth transitions while offloading the tedious `translate3d` (or was it `transform`?) work to native hardware acceleration. Many thanks go to [@eddyverbruggen](https://twitter.com/eddyverbruggen) for all the hard work that went into this plugin!

<!-- more -->


### PhoneGap/Cordova CLI 5

![PhoneGap CLI v5 in action]({{ site.baseurl }}/images/starter-kit-improvements/phonegap_cli_5.gif)

The latest PhoneGap command line interface (CLI) release contains a [bunch of improvements](http://phonegap.com/blog/2015/04/28/phonegap-cli-5.0.0-0.27.0/), but is (unfortunately) not compatible with the Geometrixx sample that shipped with 6.1. Not to fear: we will be releasing a rev of the sample shortly. In the meantime our Starter Kit is all set to take advantage of the new CLI, including:

- Cordova Android v4, which introduces support for [Crosswalk](https://crosswalk-project.org/)!
- The use of config.xml to manage platforms and plugins - a tidy alternative to writing custom hooks
- Latest versions of all core plugins, including PhoneGap's brand new [Content Sync plugin](https://github.com/phonegap/phonegap-plugin-contentsync)
- Analytics instrumentation with Adobe's Mobile Services plugin


### Separation of code from authorable content

![content-dev and content-author have split]({{ site.baseurl }}/images/starter-kit-improvements/separation.png)

The code you write and the content your authors manage has been separated into two content packages to facilitate management as your AEM Apps project grows. With this model, you can continue to iterate on the code while authors work on the content without stepping on one another's changes.


### ... And more!

![Responsive simulator in action]({{ site.baseurl }}/images/starter-kit-improvements/responsive_sim.gif)

- Responsive Simulator in the touch optimized editor is enabled by default
- Starter Kit no longer includes a dependency on Geometrixx app code
- Cordova splash page now sticks around until app initialization is complete


We hope you find the new and improved [Starter Kit](https://github.com/Adobe-Marketing-Cloud-Apps/aem-phonegap-starter-kit) helpful for bootstrapping your next AEM Apps project! Please feel free to reach out in the comments below if you have any issues making it work for you, or have any other questions on AEM Apps.

